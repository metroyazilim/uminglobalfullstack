import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageContentBlocks } from "@/components/PageContentBlocks";
import { getPublishedCustomPage } from "@/lib/content/custom-pages";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedCustomPage(slug);
  return page ? { title: `${page.title} | UMIN Global`, alternates: { canonical: `/pages/${page.slug}` } } : {};
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublishedCustomPage(slug);
  if (!page) notFound();

  return (
    <>
      <Header />
      <main className="pt-[72px] lg:pt-[104px]">
        <PageContentBlocks blocks={page.blocks} />
      </main>
      <Footer />
    </>
  );
}
