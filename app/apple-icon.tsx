import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen and Safari bookmark icon. Separate from app/icon.tsx because Apple renders it
// at 180px with rounded corners applied by the OS, so the monogram is drawn on a filled square
// with its own optical padding instead of being upscaled from 32px.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: "#0a1a2f",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}>U</div>
        <div style={{ width: 52, height: 6, background: "rgb(0, 83, 206)" }} />
      </div>
    ),
    size,
  );
}
