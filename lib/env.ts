// Admin panel environment contract. Same shape as anton/kadik's lib/env.ts:
// every gate is a plain boolean check read lazily, so a deployment without
// the admin panel configured still boots the public site.

const MIN_AUTH_SECRET_LENGTH = 32;

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function hasAuthSecret(): boolean {
  return Boolean(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= MIN_AUTH_SECRET_LENGTH);
}

export function requireDatabase(): string {
  const value = process.env.DATABASE_URL;
  if (!value) {
    throw new Error("DATABASE_URL is required for the admin panel and database-backed content.");
  }
  return value;
}

export function requireAuthSecret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < MIN_AUTH_SECRET_LENGTH) {
    throw new Error("AUTH_SECRET must be at least 32 characters long.");
  }
  return value;
}

export function getAdminBootstrap(): { email: string; password: string } {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the first admin.");
  }
  if (password.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters long.");
  }
  return { email: email.trim().toLowerCase(), password };
}

/** R2 media storage is optional: without it the media library falls back
 * to a dev-only, non-persistent in-memory provider (lib/media/storage.ts). */
export function hasMediaStorage(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET,
  );
}
