import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// Shared social-card renderer. Every opengraph-image route passes its own eyebrow/title/subtitle
// so a shared link shows the page it points at rather than one generic brand image.
export function ogCard({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a1a2f",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 4, background: "#0053ce" }} />
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 24, letterSpacing: 4, textTransform: "uppercase" }}>
            {eyebrow}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#fff",
              fontSize: title.length > 34 ? 60 : 76,
              fontWeight: 800,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 28, lineHeight: 1.3 }}>{subtitle}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, color: "#fff", fontSize: 34 }}>
          <span style={{ fontWeight: 800 }}>UMIN</span>
          <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>GLOBAL</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
