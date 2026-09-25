/**
 * What counts as a usable image reference in the admin.
 *
 * Three legitimate shapes exist in this project and all must pass:
 *   - `""` — not set (the caller decides whether that is allowed)
 *   - `/team/anthon.png` — a site-relative path, which is what the bundled
 *     content in `components/*.ts` uses and what `/api/manage/media/dev-object`
 *     returns when R2 is not configured
 *   - `https://pub-….r2.dev/uploads/…` — an absolute URL from R2
 * Protocol-relative `//host/path` is rejected: it resolves against whatever
 * scheme the page was served over and is never what an editor means.
 */
export function isAllowedImageRef(value: string): boolean {
  if (value === "") return true;
  if (value.startsWith("//")) return false;
  if (value.startsWith("/")) return true;
  return /^https?:\/\/\S+$/i.test(value);
}

export const IMAGE_REF_MESSAGE = "Enter an image URL or a site path starting with /.";
