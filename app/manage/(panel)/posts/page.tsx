import { Newspaper } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { PageHeader } from "@/components/admin/PageHeader";
import { pageShell } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { CreatePostButton, PostsListView } from "./PostsListView";

const PAGE_SIZE = 20;
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export default async function PostsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  await requireAdmin();
  const query = await searchParams;
  const requestedPage = Number.parseInt(query.page ?? "1", 10);
  const total = await prisma.post.count();
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Number.isFinite(requestedPage) ? Math.min(Math.max(requestedPage, 1), pageCount) : 1;
  const posts = await prisma.post.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      title: true,
      topic: true,
      date: true,
      status: true,
      version: true,
    },
  });

  const rows = posts.map((post) => ({
    id: post.id,
    title: post.title,
    topic: post.topic,
    dateLabel: dateFormatter.format(post.date),
    status: post.status,
    version: post.version,
  }));

  return (
    <div className={pageShell}>
      <PageHeader
        eyebrow="Content"
        title="Insights"
        description="Manage articles chronologically, edit drafts, and update their publication status."
        action={<CreatePostButton />}
      />

      {total > 0 ? (
        <PostsListView posts={rows} page={page} pageSize={PAGE_SIZE} total={total} />
      ) : (
        <EmptyState icon={Newspaper} title="No posts yet" description="Use the “New post” button to create your first Insights post." />
      )}
    </div>
  );
}
