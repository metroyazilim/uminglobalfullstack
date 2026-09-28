import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { card, helpText, pageShell } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { parsePageBlocks } from "@/lib/content/page-content";
import { PAGE_CONTENT_SEEDS, isPlaceholderPageBlocks } from "@/lib/content/page-content-seeds";
import { prisma } from "@/lib/db";
import { findSitePage, isPageContentKey } from "@/lib/site-pages";
import { PageContentEditor } from "./PageContentEditor";

export const dynamic = "force-dynamic";

type Params = Promise<{ key: string }>;

export default async function PageContentEditPage({ params }: { params: Params }) {
  await requireAdmin();
  const { key } = await params;
  if (!isPageContentKey(key)) notFound();
  const page = findSitePage(key);
  if (!page) notFound();

  const row = await prisma.pageContent.findUnique({ where: { key } });
  const storedBlocks = row ? parsePageBlocks(row.blocks) ?? [] : [];
  const blocks = isPlaceholderPageBlocks(page.label, storedBlocks) ? PAGE_CONTENT_SEEDS[key] : storedBlocks;

  return (
    <div className={pageShell}>
      <PageHeader eyebrow="Page content" title={`${page.label} content`} description={`Edit published blocks for ${page.path}. Empty or unpublished content keeps the bundled page as the fallback.`} />
      <section className={`${card} p-5 sm:p-7`}>
        <p className={`${helpText} mb-6`}>Blocks are rendered above the bundled page layout. Save a draft while editing, then publish when the content is ready.</p>
        <PageContentEditor keyName={key} version={row?.version ?? 0} blocks={blocks} />
      </section>
    </div>
  );
}
