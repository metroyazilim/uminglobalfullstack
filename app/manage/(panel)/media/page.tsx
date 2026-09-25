import { PageHeader } from "@/components/admin/PageHeader";
import { pageShell } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { listMediaAssets } from "@/lib/media/service";
import { MediaLibraryView } from "./MediaLibraryView";

type SearchParams = Promise<{ page?: string }>;

export default async function MediaPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const { page: pageParam } = await searchParams;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const result = await listMediaAssets(prisma, { archived: false, page: requestedPage });

  return (
    <div className={pageShell}>
      <PageHeader
        eyebrow="Content"
        title="Media Library"
        description="Upload images and documents, edit their descriptions, and use asset URLs in content."
      />
      <MediaLibraryView assets={result.assets} page={result.page} pageSize={result.pageSize} total={result.total} />
    </div>
  );
}
