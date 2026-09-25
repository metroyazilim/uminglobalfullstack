import DOMPurify from "isomorphic-dompurify";

type RichTextProps = {
  html: string;
  className?: string;
};

export function RichText({ html, className }: RichTextProps) {
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "strong", "em", "ul", "ol", "li", "a", "br", "blockquote"],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}
