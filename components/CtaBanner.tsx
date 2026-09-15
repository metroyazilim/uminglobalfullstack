import Image from "next/image";
import Button from "./ui/Button";

// Closing band, repeated at the foot of every page. A photograph behind the ink overlay gives
// the one repeated section on the site some weight instead of a flat fill; the overlay keeps
// contrast identical to the old solid background so the copy reads the same everywhere.
//
// The photograph goes through next/image rather than a CSS background: as a background it was a
// full-size JPEG fetched on every page, below the fold, with no format negotiation and no way to
// defer it.
export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <Image
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&h=700&q=80"
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ink/80" />
      <div className="relative mx-auto flex w-full max-w-[1320px] flex-col gap-7 px-6 py-14 md:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-16">
        <div className="max-w-[620px]">
          <span className="t-eyebrow flex items-center gap-3 text-white/45">
            <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
            Build · Grow · Scale
          </span>
          <h2 className="t-h2 pt-4 text-white">Let&rsquo;s talk about what you are building</h2>
          <p className="t-lead pt-3 text-cta-copy">
            Tell us where the business is today. We will tell you what it takes.
          </p>
        </div>
        <Button href="/contact" size="lg" className="self-start lg:self-auto">
          Start a Project
        </Button>
      </div>
    </section>
  );
}
