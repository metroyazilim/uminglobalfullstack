import Reveal from "./Reveal";
import SectionHeading from "./ui/SectionHeading";
import JsonLd from "./JsonLd";

export interface FaqItem {
  question: string;
  answer: string;
}

// Questions clients actually ask on a call, answered on the page. Emits FAQPage structured data
// alongside the visible copy, so the same content is eligible for a rich result instead of only
// living in a sales conversation.
export default function FaqSection({ eyebrow, title, items }: { eyebrow: string; title: string; items: FaqItem[] }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <SectionHeading eyebrow={eyebrow} title={title} />
      <dl className="grid grid-cols-1 gap-x-16 pt-8 lg:grid-cols-2">
        {items.map((item, index) => (
          <Reveal key={item.question} delay={index === 0 ? 0 : index === 1 ? 1 : 2}>
            <div className="py-5">
              <dt className="t-h3 text-ink">{item.question}</dt>
              <dd className="t-body pt-2 text-body">{item.answer}</dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </>
  );
}
