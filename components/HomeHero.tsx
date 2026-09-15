import Button from "./ui/Button";

// Home masthead: Manhattan photograph, one claim, one sentence, two actions. The copy used to
// run five lines; on a hero that is reading work, not a claim. One `.enter` animation carries the
// whole block so nothing animates over anything else.
export default function HomeHero() {
  return (
    <section className= "relative overflow-hidden">
      <div
        className= "absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1920&h=1080&q=80")',
        }}
      />
      <div className= "absolute inset-0 bg-ink/75" />
      <div className= "relative mx-auto w-full max-w-[1320px] px-6 py-16 md:px-10 lg:px-16 lg:py-28">
        <div className= "enter max-w-[760px]">
          <span className= "t-eyebrow flex items-center gap-3 text-white/55">
            <span aria-hidden= "true" className= "h-[2px] w-6 bg-accent" />
            New York · Technology, Growth &amp; Ventures
          </span>
          <h1 className= "t-hero pt-5 text-white">From idea to global business</h1>
          <p className= "t-lead max-w-[560px] pt-5 text-hero-copy">
            We don&rsquo;t just build software. We build the technology, brand and growth engine a
            company needs to scale &mdash; in one team.
          </p>
          <div className= "flex flex-col gap-3 pt-8 sm:flex-row sm:items-center">
            <Button href= "/contact" size= "lg">
              Start a Project
            </Button>
            <Button href= "/growth-marketing" variant= "outlineLight" size= "lg">
              Grow With UMIN
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
