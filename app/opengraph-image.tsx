import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "UMIN Global - Higher Thinking. Greater Possibilities.";

// Default social card for every route that does not generate its own. Rendered at build time
// from the brand tokens rather than shipped as a static PNG, so a copy change never leaves a
// stale image behind.
export default function OpengraphImage() {
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
            New York · Six regions
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ color: "#fff", fontSize: 76, fontWeight: 800, letterSpacing: -2, lineHeight: 1.05 }}>
            From idea to global business
          </div>
          <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 30, lineHeight: 1.3 }}>
            Technology, AI, growth, ventures and market entry - one senior team.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, color: "#fff", fontSize: 34 }}>
          <span style={{ fontWeight: 800 }}>UMIN</span>
          <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>GLOBAL</span>
        </div>
      </div>
    ),
    size,
  );
}
