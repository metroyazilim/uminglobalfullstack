import { NextResponse } from "next/server";
import { recordAudit, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { convertImageAssetsToWebp } from "@/lib/media/service";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const admin = await requireAdmin();
    const result = await convertImageAssetsToWebp(prisma);
    await recordAudit({
      action: "convert-webp",
      entity: "MediaAsset",
      userId: admin.id,
      metadata: result,
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Media conversion failed." },
      { status: 500 },
    );
  }
}
