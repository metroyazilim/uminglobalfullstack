import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeroBanner from "@/components/PageHeroBanner";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, webPageJsonLd } from "@/components/structuredData";

// The page every ImageObject on the site names as its `license` and `acquireLicensePage`
// (components/structuredData.ts). Google Images shows a "Licensable" badge for photos that
// carry both, and links to this page from it.
const DESCRIPTION =
  "Photographs on uminglobal.com, including portraits of the UMIN Global team, are owned by UMIN Global. How to request permission to use them.";

export const metadata: Metadata = {
  title: "Image Licence | UMIN Global",
  description: DESCRIPTION,
  alternates: { canonical: "/image-license" },
  openGraph: { title: "Image Licence | UMIN Global", description: DESCRIPTION, url: "/image-license" },
};

export default function ImageLicensePage() {
  return (
    <>
      <JsonLd data={webPageJsonLd({ path: "/image-license", name: "Image Licence", description: DESCRIPTION })} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Image Licence", path: "/image-license" }])} />
      <Header />
      <div className="pt-[72px] lg:pt-[104px]">
        <main>
          <PageHeroBanner title="Image licence" breadcrumbLabel="Image licence" kicker="Photographs and portraits on this site." />
          <Section space="lg">
            <div className="max-w-[680px]">
              <p className="t-lead text-ink">
                Photographs published on uminglobal.com - including portraits of the UMIN Global team and images of
                the projects we build - are owned by UMIN Global. All rights reserved.
              </p>
              <h2 className="t-h3 pt-8 text-ink">Press and editorial use</h2>
              <p className="t-body pt-4 text-body">
                Journalists and event organisers may use team portraits to accompany coverage of UMIN Global or the
                person pictured, with the credit &ldquo;Photo: UMIN Global&rdquo;. The image may be resized but not
                otherwise altered.
              </p>
              <h2 className="t-h3 pt-8 text-ink">Any other use</h2>
              <p className="t-body pt-4 text-body">
                Commercial use, use in advertising, or use that implies an endorsement requires written permission.
                Send the image URL and the intended use and we will reply with terms.
              </p>
              <div className="pt-8">
                <Button href="/contact">Request permission</Button>
              </div>
            </div>
          </Section>
        </main>
        <Footer />
      </div>
    </>
  );
}
