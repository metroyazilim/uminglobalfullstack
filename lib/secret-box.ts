import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { requireAuthSecret } from "./env";

/**
 * Symmetric encryption for the one secret the admin panel has to store at
 * rest: the SMTP password. AES-256-GCM with a key derived from
 * `AUTH_SECRET`, so rotating that secret invalidates stored ciphertext the
 * same way it invalidates sessions — an operator re-enters the password.
 *
 * Format: `v1.<iv-base64url>.<tag-base64url>.<ciphertext-base64url>`. The
 * version prefix exists so a future algorithm change can be detected rather
 * than mis-decrypted.
 */
const VERSION = "v1";

function key(): Buffer {
  return createHash("sha256").update(`umin-secret-box:${requireAuthSecret()}`).digest();
}

export function sealSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  return [VERSION, iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

/** Returns `null` for anything that is not a well-formed, authentic
 * ciphertext — a tampered or stale value degrades to "no password stored"
 * instead of throwing inside a request. */
export function openSecret(sealed: string | null | undefined): string | null {
  if (!sealed) return null;
  const [version, ivPart, tagPart, dataPart] = sealed.split(".");
  if (version !== VERSION || !ivPart || !tagPart || !dataPart) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivPart, "base64url"));
    decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
    return Buffer.concat([decipher.update(Buffer.from(dataPart, "base64url")), decipher.final()]).toString("utf8");
  } catch (error) {
    console.error("[secret-box] could not open sealed secret", error instanceof Error ? error.message : error);
    return null;
  }
}
