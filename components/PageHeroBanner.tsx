import Link from "next/link";

// Interior page masthead. It used to be a full-bleed saturated blue block with a centred title -
// the same rhythm on every page. Now it is a compact ink band with the section marker, title and
// breadcrumb on one baseline, so the page below it owns the colour.
interface PageHeroBannerProps {
  title: string;
  breadcrumbLabel: string;
  /** One line of context under the title. Kept short: this is a masthead, not a paragraph. */
  kicker?: string;
  /** Intermediate crumb for nested pages, e.g. Services on /services/<slug>. */
  breadcrumbParent?: { label: string; href: string };
}

export default function PageHeroBanner({ title, breadcrumbLabel, kicker, breadcrumbParent }: PageHeroBannerProps) {
  return (
    <section className="relative bg-ink">
      <div className="mx-auto w-full max-w-[1320px] px-6 py-10 md:px-10 lg:px-16 lg:py-14">
        <div className="enter flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[720px]">
            <span className="t-eyebrow flex items-center gap-3 text-white/45">
              <span aria-hidden="true" className="h-[2px] w-6 bg-accent" />
              UMIN Global
            </span>
            <h1 className="t-hero pt-3 text-white">{title}</h1>
            {kicker && <p className="t-lead max-w-[560px] pt-3 text-white/65">{kicker}</p>}
          </div>
          <nav aria-label="Breadcrumb" className="shrink-0">
            <ol className="t-small flex flex-wrap gap-2 text-white/45">
              <li>
                <Link href="/" className="transition-colors duration-200 hover:text-white">
                  Home
                </Link>
              </li>
              {breadcrumbParent && (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={breadcrumbParent.href} className="transition-colors duration-200 hover:text-white">
                      {breadcrumbParent.label}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">/</li>
              <li className="text-white/80">{breadcrumbLabel}</li>
            </ol>
          </nav>
        </div>
      </div>
      <div aria-hidden="true" className="h-[3px] w-full bg-accent" />
    </section>
  );
}
