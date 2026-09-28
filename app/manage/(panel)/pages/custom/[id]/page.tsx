import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/PageHeader";
import { card, helpText, pageShell } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { parsePageBlocks } from "@/lib/content/page-content";
import { prisma } from "@/lib/db";
import { CustomPageEditor } from "../CustomPageEditor";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function CustomPageEditPage({ params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const page = await prisma.customPage.findUnique({ where: { id } });
  if (!page) notFound();
  const blocks = parsePageBlocks(page.blocks) ?? [];

  return (
    <div className={pageShell}>
      <PageHeader eyebrow="Site Content" title={page.title || "Custom page"} description="Use the same block library as the fixed pages. Choose any block, add images from Media, then save or publish." />
      <section className={`${card} p-4 sm:p-5`}>
        <p className={`${helpText} mb-4`}>Public URL: /pages/{page.slug}</p>
        <CustomPageEditor id={page.id} version={page.version} title={page.title} slug={page.slug} blocks={blocks} />
      </section>
    </div>
  );
}
