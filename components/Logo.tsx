import Image from "next/image";

// The wordmark, from the supplied artwork (public/brand/umin-logo.svg, trimmed
// to the ink so there is no dead padding around it). Two variants: `dark` for
// light surfaces and `light` — the same paths with the type recoloured white,
// gold stripe untouched — for the navy footer and any inverted panel.
//
// `unoptimized` on purpose: these are vectors, so the image optimizer has
// nothing to gain, and it keeps SVG serving independent of
// `images.dangerouslyAllowSVG`.

const SOURCE = {
  dark: "/brand/umin-logo.svg",
  light: "/brand/umin-logo-light.svg",
} as const;

// Intrinsic ratio of the trimmed artwork: 907.5 × 288.92.
const RATIO = 907.5 / 288.92;

export default function Logo({
  variant = "dark",
  className,
  height = 32,
  priority = false,
}: {
  variant?: keyof typeof SOURCE;
  /** Tailwind sizing; height-based classes (`h-6 w-auto`) are the norm here. */
  className?: string;
  /** Intrinsic height handed to next/image — the rendered size comes from `className`. */
  height?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={SOURCE[variant]}
      alt="UMIN Global"
      width={Math.round(height * RATIO)}
      height={height}
      className={className}
      priority={priority}
      unoptimized
    />
  );
}
