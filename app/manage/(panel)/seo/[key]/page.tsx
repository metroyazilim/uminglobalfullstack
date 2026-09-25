import { redirect } from "next/navigation";

export default async function LegacySeoEditorPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  redirect(`/manage/seo?item=page:${key}`);
}
