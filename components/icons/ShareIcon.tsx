// Stand-in for Font Awesome's fa-share-nodes, used as the first badge in the blog-post share row.
export default function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox= "0 0 448 512" fill= "currentColor" className={className} aria-hidden= "true">
      <path d= "M352 224c35.3 0 64-28.7 64-64s-28.7-64-64-64s-64 28.7-64 64c0 4.2 .4 8.3 1.2 12.2l-124.6 73c-11.5-11-27.1-17.7-44.3-17.7c-35.3 0-64 28.7-64 64s28.7 64 64 64c17.2 0 32.8-6.8 44.3-17.7l124.6 73c-.8 3.9-1.2 8-1.2 12.2c0 35.3 28.7 64 64 64s64-28.7 64-64s-28.7-64-64-64c-17.2 0-32.8 6.8-44.3 17.7l-124.6-73c.8-3.9 1.2-8 1.2-12.2s-.4-8.3-1.2-12.2l124.6-73c11.5 11 27.1 17.7 44.3 17.7z" />
    </svg>
  );
}
