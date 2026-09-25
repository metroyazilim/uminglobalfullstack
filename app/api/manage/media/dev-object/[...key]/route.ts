import { NextResponse } from "next/server";
import { getStorageProvider, MemoryStorageProvider } from "@/lib/media/storage";

type Params = Promise<{ key: string[] }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const provider = getStorageProvider();
  if (!(provider instanceof MemoryStorageProvider)) {
    return new NextResponse(null, { status: 404 });
  }

  const { key } = await params;
  const entry = provider.getObject(key.join("/"));
  if (!entry) return new NextResponse(null, { status: 404 });

  return new NextResponse(new Uint8Array(entry.buffer), {
    headers: {
      "Content-Type": entry.mimeType,
      "Cache-Control": "no-store",
    },
  });
}
