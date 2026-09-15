// Every page section goes through here, which is what guarantees the vertical gap between
// sections and the horizontal container padding. Tones alternate the reading surface so the page
// has rhythm instead of one uninterrupted white column.
type Tone = "white" | "gray" | "ink";
type Space = "sm" | "md" | "lg";

const TONES: Record<Tone, string> = {
  white: "bg-white text-body",
  gray: "bg-section-gray text-body",
  ink: "bg-ink text-cta-copy",
};

const SPACE: Record<Space, string> = {
  sm: "py-12 lg:py-16",
  md: "py-16 lg:py-24",
  lg: "py-20 lg:py-32",
};

interface SectionProps {
  children: React.ReactNode;
  tone?: Tone;
  space?: Space;
  /** Hairline above the section - used where two same-tone sections meet. */
  rule?: boolean;
  id?: string;
  className?: string;
}

export default function Section({
  children,
  tone = "white",
  space = "md",
  rule = false,
  id,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${TONES[tone]} ${SPACE[space]} ${rule ? "border-t border-divider" : ""} ${id ? "scroll-mt-[120px]" : ""} ${className}`}
    >
      <div className= "mx-auto w-full max-w-[1320px] px-6 md:px-10 lg:px-16">{children}</div>
    </section>
  );
}
