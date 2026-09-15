// One place that emits schema.org JSON-LD, so no page hand-rolls a <script> tag with
// dangerouslySetInnerHTML. Server component: the markup is serialised at build time and never
// hydrated.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
