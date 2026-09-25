import { PrismaClient } from "@prisma/client";
import { requireDatabase } from "./env";

// Same singleton-via-globalThis pattern as anton/kadik's lib/db.ts: Next.js
// dev (Turbopack/HMR) re-evaluates route modules independently per request,
// so a plain module-level `new PrismaClient()` would open a new pool on
// every reload. `globalThis` survives that.
const globalForPrisma = globalThis as unknown as { uminPrisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  requireDatabase();
  if (!globalForPrisma.uminPrisma) {
    globalForPrisma.uminPrisma = new PrismaClient();
  }
  return globalForPrisma.uminPrisma;
}

/** Lazily resolves the real client on first property access, so importing
 * `prisma` never throws in a module whose route hasn't yet checked
 * `hasDatabase()` — only calling into it does. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    return Reflect.get(getPrisma(), property);
  },
});
