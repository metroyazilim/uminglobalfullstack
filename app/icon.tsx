import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// App Router auto-serves this as /icon and wires it into every page's <link rel="icon"> -
// no favicon.ico asset needed. Same ink/accent pairing as the rest of the brand, rendered as a
// monogram rather than shrinking the wordmark, which stops being legible at 32px.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a1a2f",
          color: "#fff",
          fontSize: 20,
          fontWeight: 800,
          fontFamily: "sans-serif",
        }}
      >
        U
      </div>
    ),
    size,
  );
}
