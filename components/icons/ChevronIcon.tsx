// Stand-in for Font Awesome's fa-chevron-left/right, used by the blog pagination prev/next buttons.
export default function ChevronIcon({
  direction = "left",
  className,
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      viewBox= "0 0 320 512"
      fill= "currentColor"
      className={className}
      style={direction === "right" ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden= "true"
    >
      <path d= "M41 233.4c-9.4 9.4-9.4 24.6 0 33.9l192 192c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9L100.9 250l166-166c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-192 192z" />
    </svg>
  );
}
