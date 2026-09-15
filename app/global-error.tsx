"use client";

// Last resort: an error thrown by the root layout itself, which is outside app/error.tsx's
// boundary. It has to render its own <html>/<body> because the failing layout never produced
// them, so it cannot use Header/Footer - those sit inside the tree that just failed.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0B1220", color: "#FFFFFF", fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "20px",
            padding: "48px 24px",
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          <span style={{ fontSize: "12px", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.5 }}>
            UMIN Global
          </span>
          <h1 style={{ fontSize: "32px", lineHeight: 1.2, margin: 0 }}>The site failed to load</h1>
          <p style={{ fontSize: "16px", lineHeight: 1.6, opacity: 0.7, margin: 0 }}>
            Reload the page. If it keeps failing, email{" "}
            <a href="mailto:info@uminglobal.com" style={{ color: "#2C7BE5" }}>
              info@uminglobal.com
            </a>{" "}
            and we will look into it.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: "#2C7BE5",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "6px",
                padding: "14px 24px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reload
            </button>
            {/* Deliberately a plain anchor, not next/link: the root layout failed, so the
                router tree this boundary replaces is gone and a client-side navigation would
                have nothing to render into. A full document load is the recovery path. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                border: "2px solid rgba(255,255,255,0.4)",
                borderRadius: "6px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              Home
            </a>
          </div>
          {error.digest && <p style={{ fontSize: "13px", opacity: 0.45, margin: 0 }}>Reference: {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
