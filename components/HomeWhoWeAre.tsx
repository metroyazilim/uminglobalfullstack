import Reveal from "./Reveal";
import Button from "./ui/Button";

// The "who we are" column beside the photo pair. Two short sentences: the long version lives on
// the About page, and repeating it here made the home page read like a brochure.
export default function HomeWhoWeAre() {
  return (
    <Reveal>
      <span className= "t-eyebrow flex items-center gap-3 text-label">
        <span aria-hidden= "true" className= "h-[2px] w-6 bg-accent" />
        Who we are
      </span>
      <h2 className= "t-h2 pt-4 text-ink">Higher thinking. Greater possibilities.</h2>
      <p className= "t-lead pt-4 text-body">
        A New York technology and growth company for founders and established businesses. Product,
        brand, marketing and expansion decisions are made once, by one senior team.
      </p>
      <dl className= "mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-divider pt-6">
        <div>
          <dt className= "t-eyebrow text-label">Founded in</dt>
          <dd className= "t-h3 pt-1 text-ink">New York</dd>
        </div>
        <div>
          <dt className= "t-eyebrow text-label">Working across</dt>
          <dd className= "t-h3 pt-1 text-ink">6 regions</dd>
        </div>
      </dl>
      <Button href= "/about" variant= "outlineDark" className= "mt-8">
        About UMIN
      </Button>
    </Reveal>
  );
}
