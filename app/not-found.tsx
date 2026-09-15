import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/Reveal";
import { SERVICES } from "@/components/services";

// Served with a real 404 status for any URL the site does not have, including an unknown
// /services, /offices or /team slug. It carries the full chrome on purpose: a bare "not found"
// message is a dead end, and most 404 hits are a mistyped or stale link from someone who wanted
// a specific page - so the useful routes are one click away.
const TITLE = "Page not found | UMIN Global";
const DESCRIPTION =
  "That page does not exist. Find UMIN Global's capabilities, services, offices and contact details from here.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // A 404 must never enter the index, and it must not pass authority on either: its links are
  // navigation aids, not editorial endorsements of those URLs.
  robots: { index: false, follow: false },
};

const DESTINATIONS: { href: string; label: string; detail: string }[] = [
  { href: "/", label: "Home", detail: "What UMIN Global does, in one page." },
  { href: "/what-we-do", label: "What We Do", detail: "The five capabilities and how they combine." },
  { href: "/services", label: "All Services", detail: `${SERVICES.length} services with a page each.` },
  { href: "/about", label: "About", detail: "How the company is built and how it works." },
  { href: "/offices", label: "Offices", detail: "Six cities across four continents." },
  { href: "/insights", label: "Insights", detail: "Notes on building and scaling companies." },
  { href: "/team", label: "Team", detail: "Who you work with." },
  { href: "/contact", label: "Contact", detail: "Email us or send a project brief." },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title="This page does not exist"
            breadcrumbLabel="404"
            kicker="The address is wrong, or the page it pointed to has moved."
          />

          <Section space="lg">
            <SectionHeading
              eyebrow="Error 404"
              title="Let's get you to the right place"
              lead="Everything on the site is reachable from the links below - or from the navigation at the top of the page."
            />

            <div className="grid grid-cols-1 gap-x-10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {DESTINATIONS.map((item, index) => (
                <Reveal key={item.href} delay={index === 0 ? 0 : index === 1 ? 1 : 2}>
                  <Link href={item.href} className="group block border-t border-divider py-6">
                    <span className="t-h4 flex items-center gap-2 text-ink group-hover:text-accent">
                      {item.label}
                      <span
                        aria-hidden="true"
                        className="text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                      >
                        &rarr;
                      </span>
                    </span>
                    <span className="t-small block pt-1 text-label">{item.detail}</span>
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-10">
              <Button href="/">Back to home</Button>
              <Button href="/contact" variant="outlineDark">
                Talk to us
              </Button>
            </div>
          </Section>
        </main>
        <Footer />
      </div>
    </>
  );
}
