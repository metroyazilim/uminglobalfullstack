# syntax=docker/dockerfile:1

# UMIN Global — production image for Docker Compose / Dokploy.
#
# Four stages so the runtime image carries the standalone server bundle plus a
# production-only Prisma CLI (client, engines and every transitive runtime
# dependency, resolved from the lockfile - see the `prod-deps` stage below).
# Build-time NEXT_PUBLIC_* values are baked in by `next build`, so they
# arrive as build args; every secret (database, SMTP, R2) stays runtime-only.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------------------------------------------------------------- dependencies
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ----------------------------------------------------------------- prod-deps
# `prisma migrate deploy` is invoked directly by the entrypoint - it is never
# imported by application code, so Next's standalone output tracing (below)
# never bundles it or its dependency tree. Previously this stage cherry-picked
# `node_modules/{prisma,@prisma,.prisma}` out of the full dev install, which
# silently broke when Prisma 6.19 added `@prisma/config`, pulling in `effect`,
# `c12`, `deepmerge-ts` and `empathic` as siblings under top-level
# `node_modules/` that were never copied ("Cannot find module 'effect'" at
# container boot). `prisma` now lives in `dependencies` (package.json), so a
# plain lockfile-driven `npm ci --omit=dev` resolves and flattens its entire
# runtime closure correctly - no hand-picked folder list to drift again.
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

# --------------------------------------------------------------------- builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public origin is inlined into the client bundle at build time.
ARG NEXT_PUBLIC_SITE_URL=https://uminglobal.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# `prisma generate` runs against the schema only — no database connection needed.
RUN npx prisma generate
RUN npm run build

# ---------------------------------------------------------------------- runner
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Standalone server + static assets.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema, migrations, client and CLI so the entrypoint can run
# `prisma migrate deploy` before the server accepts traffic.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules

COPY --chown=nextjs:nodejs docker/entrypoint.sh /app/docker/entrypoint.sh
RUN chmod +x /app/docker/entrypoint.sh

USER nextjs
EXPOSE 3000

# Compose/Dokploy health check target — a cheap route that does not touch the database.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/app/docker/entrypoint.sh"]
CMD ["node", "server.js"]
