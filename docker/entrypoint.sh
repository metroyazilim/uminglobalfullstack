#!/bin/sh
# Applies pending Prisma migrations, then hands over to the Next.js server.
#
# `migrate deploy` is idempotent: it only runs migrations whose name is missing
# from the `_prisma_migrations` table, so restoring a database dump that already
# contains that table is safe — nothing is re-applied and no data is touched.
set -e

if [ -z "${DATABASE_URL}" ]; then
  echo "entrypoint: DATABASE_URL is not set — starting without running migrations." >&2
else
  echo "entrypoint: applying Prisma migrations…"
  node ./node_modules/prisma/build/index.js migrate deploy --schema ./prisma/schema.prisma
  echo "entrypoint: migrations up to date."
fi

exec "$@"
