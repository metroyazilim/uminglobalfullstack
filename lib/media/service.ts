import "server-only";

import sharp from "sharp";
import type { PrismaClient } from "@prisma/client";
import { getStorageProvider } from "./storage";
import { calculateChecksum } from "./validation";
import type { MediaAssetDto, ValidatedMediaInput } from "./types";

function generateObjectKey(sanitizedFilename: string): string {
  const stamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `uploads/${stamp}-${random}-${sanitizedFilename}`;
}

type MediaAssetRow = {
  id: string;
  filename: string;
  objectKey: string;
  url: string;
  mimeType: string;
  extension: string;
  kind: "IMAGE" | "DOCUMENT";
  byteSize: number;
  checksum: string;
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function toMediaAssetDto(row: MediaAssetRow): MediaAssetDto {
  return { ...row };
}

/** Uploads a validated file to storage and creates its MediaAsset row. */
export async function createMediaAsset(
  prisma: PrismaClient,
  input: ValidatedMediaInput,
  context: { userId: string },
  options?: { altText?: string; caption?: string },
): Promise<MediaAssetDto> {
  const normalized = input.kind === "IMAGE"
    ? await normalizeImageInput(input)
    : input;
  const storage = getStorageProvider();
  const objectKey = generateObjectKey(normalized.filename);
  const uploadResult = await storage.upload({ objectKey, buffer: normalized.buffer, mimeType: normalized.mimeType });

  const row = await prisma.mediaAsset.create({
    data: {
      filename: normalized.filename,
      objectKey: uploadResult.objectKey,
      url: uploadResult.url,
      mimeType: normalized.mimeType,
      extension: normalized.extension,
      kind: normalized.kind,
      byteSize: normalized.byteSize,
      checksum: normalized.checksum,
      width: normalized.width,
      height: normalized.height,
      altText: options?.altText ?? null,
      caption: options?.caption ?? null,
      uploadedById: context.userId,
    },
  });

  return toMediaAssetDto(row);
}

function webpFilename(filename: string): string {
  return filename.replace(/\.[^.]+$/, "") + ".webp";
}

async function normalizeImageInput(input: ValidatedMediaInput): Promise<ValidatedMediaInput> {
  const buffer = await sharp(input.buffer).webp({ quality: 85 }).toBuffer();
  const metadata = await sharp(buffer).metadata();
  return {
    ...input,
    buffer,
    filename: webpFilename(input.filename),
    mimeType: "image/webp",
    extension: ".webp",
    byteSize: buffer.length,
    checksum: calculateChecksum(buffer),
    width: metadata.width ?? input.width,
    height: metadata.height ?? input.height,
  };
}

/** Converts existing image rows and their R2 objects to WebP at quality 85. */
export async function convertImageAssetsToWebp(prisma: PrismaClient): Promise<{ converted: number; skipped: number }> {
  const rows = await prisma.mediaAsset.findMany({
    where: {
      kind: "IMAGE",
      OR: [{ mimeType: { not: "image/webp" } }, { extension: { not: ".webp" } }],
    },
    orderBy: { createdAt: "asc" },
  });
  const storage = getStorageProvider();
  let converted = 0;

  for (const row of rows) {
    const response = await fetch(row.url);
    if (!response.ok) throw new Error(`Could not read ${row.filename} (${response.status}).`);
    const source = Buffer.from(await response.arrayBuffer());
    const buffer = await sharp(source).webp({ quality: 85 }).toBuffer();
    const metadata = await sharp(buffer).metadata();
    const filename = webpFilename(row.filename);
    const objectKey = generateObjectKey(filename);
    const uploadResult = await storage.upload({ objectKey, buffer, mimeType: "image/webp" });

    try {
      await prisma.mediaAsset.update({
        where: { id: row.id },
        data: {
          filename,
          objectKey: uploadResult.objectKey,
          url: uploadResult.url,
          mimeType: "image/webp",
          extension: ".webp",
          byteSize: buffer.length,
          checksum: calculateChecksum(buffer),
          width: metadata.width ?? row.width,
          height: metadata.height ?? row.height,
        },
      });
    } catch (error) {
      await storage.delete(uploadResult.objectKey).catch(() => false);
      throw error;
    }

    await storage.delete(row.objectKey);
    converted += 1;
  }

  return { converted, skipped: await prisma.mediaAsset.count({ where: { kind: "IMAGE" } }) - converted };
}

export async function listMediaAssets(
  prisma: PrismaClient,
  filter?: { archived?: boolean; kind?: "IMAGE" | "DOCUMENT"; page?: number; pageSize?: number },
): Promise<{ assets: MediaAssetDto[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, filter?.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filter?.pageSize ?? 40));
  const where = { archived: filter?.archived ?? false, ...(filter?.kind ? { kind: filter.kind } : {}) };

  const [rows, total] = await Promise.all([
    prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.mediaAsset.count({ where }),
  ]);

  return { assets: rows.map(toMediaAssetDto), total, page, pageSize };
}


/** Hard delete removes the storage object and its MediaAsset row. */
export async function deleteMediaAsset(prisma: PrismaClient, id: string): Promise<boolean> {
  const row = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!row) return false;
  await getStorageProvider().delete(row.objectKey);
  await prisma.mediaAsset.delete({ where: { id } });
  return true;
}
