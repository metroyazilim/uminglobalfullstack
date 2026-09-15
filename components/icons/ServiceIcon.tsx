// Hand-drawn line icons for UMIN's five capabilities (technology, growth, AI, ventures, global
// strategy), reused across the capability/service cards on several pages.
export type ServiceIconName = "tech" | "growth" | "ai" | "ventures" | "globe";

export default function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox= "0 0 100 100" className={className} aria-hidden= "true">
      {name === "tech" && (
        <>
          <rect {...common} x= "16" y= "20" width= "68" height= "46" rx= "3" />
          <circle {...common} cx= "30" cy= "34" r= "4" />
          <line {...common} x1= "42" y1= "30" x2= "70" y2= "30" />
          <line {...common} x1= "42" y1= "40" x2= "70" y2= "40" />
          <line {...common} x1= "24" y1= "50" x2= "76" y2= "50" />
          <line {...common} x1= "38" y1= "66" x2= "38" y2= "78" />
          <line {...common} x1= "62" y1= "66" x2= "62" y2= "78" />
          <line {...common} x1= "26" y1= "80" x2= "74" y2= "80" />
        </>
      )}
      {name === "growth" && (
        <>
          <path {...common} d= "M16 78h68" />
          <path {...common} d= "M22 68l18-20 14 12 24-30" />
          <path {...common} d= "M62 28h16v16" />
        </>
      )}
      {name === "ai" && (
        <>
          <rect {...common} x= "30" y= "30" width= "40" height= "40" rx= "6" />
          <circle {...common} cx= "43" cy= "47" r= "3" />
          <circle {...common} cx= "57" cy= "47" r= "3" />
          <path {...common} d= "M40 58h20" />
          <line {...common} x1= "50" y1= "30" x2= "50" y2= "16" />
          <line {...common} x1= "30" y1= "42" x2= "16" y2= "42" />
          <line {...common} x1= "30" y1= "58" x2= "16" y2= "58" />
          <line {...common} x1= "70" y1= "42" x2= "84" y2= "42" />
          <line {...common} x1= "70" y1= "58" x2= "84" y2= "58" />
        </>
      )}
      {name === "ventures" && (
        <>
          <path {...common} d= "M50 14c10 10 14 24 10 42-6 2-14 2-20 0-4-18 0-32 10-42z" />
          <circle {...common} cx= "50" cy= "38" r= "6" />
          <path {...common} d= "M40 56l-12 10 4-16" />
          <path {...common} d= "M60 56l12 10-4-16" />
          <path {...common} d= "M44 76h12l-6 10z" />
        </>
      )}
      {name === "globe" && (
        <>
          <circle {...common} cx= "50" cy= "50" r= "34" />
          <ellipse {...common} cx= "50" cy= "50" rx= "14" ry= "34" />
          <line {...common} x1= "16" y1= "50" x2= "84" y2= "50" />
          <path {...common} d= "M22 32h56" />
          <path {...common} d= "M22 68h56" />
        </>
      )}
    </svg>
  );
}
