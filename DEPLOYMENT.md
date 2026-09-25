# Deployment — Dokploy / Docker Compose

Production runs as a two-service Compose stack: `web` (Next.js standalone server)
and `db` (PostgreSQL 17). Dokploy builds the image from this repository, injects
the environment variables you define in its UI, and routes its own Traefik proxy
to `web`. No host port is published on purpose — Dokploy owns the domain and TLS.

## 1. What is in the repo

| File | Purpose |
| --- | --- |
| `Dockerfile` | Three-stage production image (deps → build → runtime). Runs as non-root `nextjs`, ships only `.next/standalone`, `public`, and the Prisma client/CLI. |
| `docker/entrypoint.sh` | Applies `prisma migrate deploy` before the server starts. Idempotent — safe on every redeploy and after restoring a dump. |
| `docker-compose.yml` | Production stack (`web` + `db`), used by Dokploy. |
| `docker-compose.dev.yml` | Local development Postgres only (`POSTGRES_PORT=5533 docker compose -f docker-compose.dev.yml up -d`). |
| `.env.production.example` | Every variable the stack reads, with notes on which are required. |
| `app/api/health/route.ts` | `GET /api/health` — container liveness probe, does not touch Postgres. |

## 2. First deployment on Dokploy

1. **Create the application** → type **Docker Compose**, point it at this Git repository and the `docker-compose.yml` at the repo root.
2. **Environment** → paste the filled-in contents of `.env.production.example`.
   Required: `NEXT_PUBLIC_SITE_URL`, `POSTGRES_PASSWORD`, `AUTH_SECRET`.
   `NEXT_PUBLIC_SITE_URL` is a **build argument** — changing it later requires a rebuild, not just a restart.
3. **Domain** → attach the domain to the `web` service, container port `3000`, enable HTTPS (Let's Encrypt).
4. **Deploy.** The entrypoint applies migrations, then the server boots on `0.0.0.0:3000`.

## 3. Moving the existing database

The current content (team, offices, insights, page SEO, site settings, media
metadata, admin users, audit log) lives in the local development database. Dumps
are produced with `pg_dump` and live in `backups/` — they are gitignored because
they contain password hashes and the encrypted SMTP secret.

Take a fresh dump before migrating:

```bash
docker exec umin-global-db-1 pg_dump -U umin -d umin_global_dev \
  --format=custom --no-owner --no-privileges -f /tmp/umin.dump
docker cp umin-global-db-1:/tmp/umin.dump ./backups/umin_$(date +%Y%m%d_%H%M%S).dump
```

Restore it into the production stack (the compose file mounts `./backups` into
the `db` container read-only):

```bash
# On the Dokploy host, from the deployed project directory:
docker compose exec -T db pg_restore -U umin -d umin_global \
  --clean --if-exists --no-owner --no-privileges < backups/umin_<timestamp>.dump
```

Restore order does not matter relative to the app: `prisma migrate deploy` only
applies migrations missing from `_prisma_migrations`, and the dump already
contains that table, so nothing is re-applied and no row is rewritten.

If you start from an empty database instead, seed it:

```bash
docker compose exec web node ./node_modules/prisma/build/index.js migrate deploy --schema ./prisma/schema.prisma
# Admin user + bundled content require the dev dependencies, so run these from a
# checkout with `npm ci` rather than from the runtime image:
npm run db:seed
npm run content:import
```

## 4. Required operational settings

- **`AUTH_SECRET`** — session signing and AES-256-GCM encryption of the SMTP password stored by the admin panel. Rotating it invalidates every session and makes the stored SMTP password unreadable (re-enter it in Settings → Email).
- **R2 media storage** — without `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, uploads are held in memory and vanish on redeploy. The admin dashboard shows a warning while this is the case.
- **SMTP** — the contact form reads the values from the admin panel first (encrypted at rest) and falls back to `SMTP_*` env variables. `CONTACT_TO` decides the recipient inbox.
- **Backups** — schedule `pg_dump` against the `db` service; the Compose volume `db-data` is the only durable copy otherwise.

## 5. Redeploys

```bash
git push            # Dokploy rebuilds the image and restarts `web`
```

Data survives: `db-data` is a named volume and migrations are additive. A schema
change only reaches production when a Prisma migration file is committed — the
entrypoint never runs `prisma db push`.

## 6. Health and logs

```bash
curl -fsS https://<domain>/api/health     # {"status":"ok","uptime":…}
docker compose logs -f web
docker compose ps                          # `db` must report (healthy)
```
