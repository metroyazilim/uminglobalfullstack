import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "UMIN Global - Higher Thinking. Greater Possibilities.";

// Default social card for every route that does not generate its own. Rendered at build time
// from the brand tokens rather than shipped as a static PNG, so a copy change never leaves a
// stale image behind.

// Read once at module scope, inlined as a data URI: satori cannot fetch a
// relative asset, and the file is part of the build input anyway.
const WORDMARK = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/brand/umin-logo-light-900.png")).toString("base64")}`;
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
            New York · Seven regions
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
        <img src={WORDMARK} alt="UMIN Global" width={300} height={96} style={{ objectFit: "contain" }} />
      </div>
    ),
    size,
  );
}
