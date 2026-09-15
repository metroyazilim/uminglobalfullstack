// Hand-drawn office building glyph for the contact page's"Corporate Headquarters" badge (not from an icon font).
export default function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox= "0 0 100 100" fill= "none" stroke= "currentColor" strokeWidth= "4" className={className} aria-hidden= "true">
      <rect x= "22" y= "14" width= "38" height= "72" />
      <rect x= "60" y= "40" width= "26" height= "46" />
      <line x1= "32" y1= "26" x2= "40" y2= "26" />
      <line x1= "46" y1= "26" x2= "54" y2= "26" />
      <line x1= "32" y1= "40" x2= "40" y2= "40" />
      <line x1= "46" y1= "40" x2= "54" y2= "40" />
      <line x1= "32" y1= "54" x2= "40" y2= "54" />
      <line x1= "46" y1= "54" x2= "54" y2= "54" />
      <line x1= "32" y1= "68" x2= "40" y2= "68" />
      <line x1= "46" y1= "68" x2= "54" y2= "68" />
      <line x1= "68" y1= "50" x2= "76" y2= "50" />
      <line x1= "68" y1= "62" x2= "76" y2= "62" />
      <line x1= "68" y1= "74" x2= "76" y2= "74" />
      <rect x= "38" y= "72" width= "8" height= "14" />
    </svg>
  );
}
