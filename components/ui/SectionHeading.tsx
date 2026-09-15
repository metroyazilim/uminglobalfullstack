import Reveal from "../Reveal";

// Eyebrow + title (+ optional lead) block that opens every section. The eyebrow sits on a short
// accent rule rather than in a pill: it reads as a printed section marker instead of a badge.
interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <Reveal className={`${centered ? "mx-auto max-w-[760px] text-center" : "max-w-[720px]"} ${className}`}>
      <span
        className={`t-eyebrow flex items-center gap-3 text-label ${centered ? "justify-center" : ""}`}
      >
        <span aria-hidden= "true" className= "h-[2px] w-6 bg-accent" />
        {eyebrow}
      </span>
      <h2 className= "t-h2 pt-4 text-ink">{title}</h2>
      {lead && <p className= "t-lead pt-4 text-body">{lead}</p>}
    </Reveal>
  );
}
