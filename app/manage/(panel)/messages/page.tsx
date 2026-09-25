import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { pageShell } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { MessagesListView } from "./MessagesListView";

const PAGE_SIZE = 25;

function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

type SearchParams = Promise<{ page?: string }>;

export default async function MessagesPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const { page: pageParam } = await searchParams;
  const page = parsePage(pageParam);

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where: {},
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: { id: true, name: true, email: true, message: true, status: true, createdAt: true },
    }),
    prisma.contactMessage.count({ where: {} }),
  ]);

  return (
    <div className={pageShell}>
      <PageHeader
        eyebrow="Communication"
        title="Messages"
        description={`${total} messages`}
      />

      <MessagesListView messages={messages} />
      <Pagination page={page} pageSize={PAGE_SIZE} total={total} basePath="/manage/messages" />
    </div>
  );
}
