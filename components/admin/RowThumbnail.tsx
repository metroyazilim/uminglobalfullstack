import Image from "next/image";
import { ImageOff } from "lucide-react";

export function RowThumbnail({ src, alt }: { src: string | null | undefined; alt: string }) {
  if (!src) {
    return (
      <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-brand-muted-surface text-brand-muted">
        <ImageOff className="size-4" aria-hidden="true" />
      </span>
    );
  }
  return (
    <span className="relative block size-10 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-brand-muted-surface">
      <Image src={src} alt={alt} fill sizes="40px" className="object-cover" unoptimized />
    </span>
  );
}
