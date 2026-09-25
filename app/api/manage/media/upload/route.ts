import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { createMediaAsset } from "@/lib/media/service";
import { MediaValidationError, validateUploadBuffer } from "@/lib/media/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ ok: false, error: "File is required." }, { status: 400 });
    }

    const altTextValue = formData.get("altText");
    const captionValue = formData.get("caption");
    const altText = typeof altTextValue === "string" ? altTextValue.trim() || undefined : undefined;
    const caption = typeof captionValue === "string" ? captionValue.trim() || undefined : undefined;
    const buffer = Buffer.from(await file.arrayBuffer());
    const validated = validateUploadBuffer(buffer, (file as File).name || "upload");
    const asset = await createMediaAsset(prisma, validated, { userId: session.id }, { altText, caption });

    return NextResponse.json({ ok: true, asset }, { status: 201 });
  } catch (error) {
    if (error instanceof MediaValidationError) {
      return NextResponse.json(
        { ok: false, error: error.message, code: error.code },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Server error" },
      { status: 500 },
    );
  }
}
