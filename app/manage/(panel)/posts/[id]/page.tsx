import { notFound } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { PostEditorPanel } from "./PostEditorPanel";

const blockSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("lead"), text: z.string() }),
  z.object({ kind: z.literal("p"), text: z.string() }),
  z.object({ kind: z.literal("h2"), text: z.string() }),
  z.object({ kind: z.literal("list"), items: z.array(z.string()) }),
  z.object({ kind: z.literal("callout"), text: z.string() }),
]);
const bodySchema = z.array(blockSchema);
const keywordsSchema = z.array(z.string());
const relatedSchema = z.array(z.object({ label: z.string(), href: z.string() }));

type Params = Promise<{ id: string }>;

export default async function PostEditorPage({ params }: { params: Params }) {
  await requireAdmin();
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  const body = bodySchema.safeParse(post.body);
  const keywords = keywordsSchema.safeParse(post.keywords);
  const related = relatedSchema.safeParse(post.related);

  return (
    <PostEditorPanel
      key={post.version}
      post={{
        id: post.id,
        version: post.version,
        status: post.status,
        slug: post.slug,
        title: post.title,
        metaTitle: post.metaTitle,
        description: post.description,
        excerpt: post.excerpt,
        date: post.date.toISOString().slice(0, 10),
        dateDisplay: post.dateDisplay,
        updated: post.updated ?? "",
        readingMinutes: post.readingMinutes,
        topic: post.topic,
        keywords: keywords.success ? keywords.data : [],
        image: post.image,
        imageAlt: post.imageAlt,
        ogTitle: post.ogTitle,
        ogSubtitle: post.ogSubtitle,
        body: body.success ? body.data : [],
        related: related.success ? related.data : [],
      }}
    />
  );
}
