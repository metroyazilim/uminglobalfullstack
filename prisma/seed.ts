// Deterministic, idempotent bootstrap: creates (or resets) the first
// SUPER_ADMIN from ADMIN_EMAIL/ADMIN_PASSWORD. Ported from anton/kadik's
// prisma/seed.ts, trimmed to this project's schema (no bilingual
// content-registry rows to seed).
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { getAdminBootstrap } from "../lib/env";

const prisma = new PrismaClient();

async function seedAdmin(): Promise<void> {
  const { email, password } = getAdminBootstrap();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await prisma.adminUser.findUnique({ where: { email } });

  if (!existing) {
    await prisma.adminUser.create({
      data: { email, passwordHash, name: "UMIN Global Admin", role: "SUPER_ADMIN" },
    });
    console.log(`seed: created SUPER_ADMIN ${email}`);
    return;
  }

  // Re-running the seed resets the bootstrap admin's password and role, and
  // invalidates its live sessions — the documented recovery path.
  await prisma.adminUser.update({
    where: { id: existing.id },
    data: { passwordHash, role: "SUPER_ADMIN", tokenVersion: { increment: 1 } },
  });
  console.log(`seed: reset SUPER_ADMIN ${email}`);
}

seedAdmin()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
