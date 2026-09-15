"use client";

// Route-level error boundary. Without it, an exception thrown while rendering any page shows
// Next's default error screen in development and a blank document in production. Here the visitor
// keeps the site chrome, can retry the render, and can reach a person.
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Vercel captures stderr from the server render; this covers the client-side case, where the
    // digest is the only thing that ties a report from a visitor to the server log entry.
    console.error("Unhandled render error", error.digest ?? error.message);
  }, [error]);

  return (
    <>
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner
            title="Something went wrong"
            breadcrumbLabel="Error"
            kicker="This page failed to load. It is not your connection."
          />

          <Section space="lg">
            <SectionHeading
              eyebrow="Error"
              title="Try again, or tell us what you were doing"
              lead="Reloading usually resolves it. If it does not, send us the page address and we will fix it."
            />
            <div className="flex flex-wrap gap-4 pt-8">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2.5 rounded-control border-2 border-accent bg-accent px-6 py-3.5 text-[14px] font-semibold leading-[20px] text-white transition-colors duration-200 hover:border-brand-hover hover:bg-brand-hover"
              >
                Reload this page
              </button>
              <Button href="/" variant="outlineDark">
                Back to home
              </Button>
              <Button href="/contact" variant="outlineDark">
                Contact us
              </Button>
            </div>
            {error.digest && (
              <p className="t-small pt-6 text-label">
                Reference: <span className="font-mono text-ink">{error.digest}</span>
              </p>
            )}
          </Section>
        </main>
        <Footer />
      </div>
    </>
  );
}
