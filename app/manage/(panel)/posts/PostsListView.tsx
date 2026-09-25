"use client";

import type { ContentStatus } from "@prisma/client";
import { Archive, Pencil, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { Pagination } from "@/components/admin/Pagination";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useToast } from "@/components/admin/Toast";
import {
  iconButton,
  primaryButton,
  table,
  tableBody,
  tableCell,
  tableHeadCell,
  tableHeadRow,
  tableRow,
  tableWrap,
} from "@/components/admin/ui";
import { createPostAction, togglePostArchiveAction, type PostActionState } from "./actions";

export type PostListRow = {
  id: string;
  title: string;
  topic: string;
  dateLabel: string;
  status: ContentStatus;
  version: number;
};

const initialActionState: PostActionState = {};

export function CreatePostButton() {
  const router = useRouter();
  const { toast } = useToast();
  const [state, action, pending] = useActionState(createPostAction, initialActionState);

  useEffect(() => {
    if (state.error) toast(state.error, "error");
    if (state.success && state.id) {
      toast(state.success);
      router.push(`/manage/posts/${state.id}`);
    }
  }, [router, state, toast]);

  return (
    <form action={action}>
      <input type="hidden" name="intent" value="create" />
      <button type="submit" className={primaryButton} disabled={pending}>
        <Plus className="size-4" aria-hidden="true" />
        {pending ? "Creating..." : "New post"}
      </button>
    </form>
  );
}

function ArchivePostButton({ post }: { post: PostListRow }) {
  const router = useRouter();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(togglePostArchiveAction, initialActionState);

  useEffect(() => {
    if (state.error) toast(state.error, "error");
    if (state.success) {
      toast(state.success);
      router.refresh();
    }
  }, [router, state, toast]);

  const archived = post.status === "ARCHIVED";
  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name="id" value={post.id} />
      <input type="hidden" name="version" value={post.version} />
      <ConfirmButton
        onConfirm={() => formRef.current?.requestSubmit()}
        confirmLabel={archived ? "Move to draft" : "Archive"}
        tone={archived ? "neutral" : "danger"}
        disabled={pending}
      >
        {archived ? <RotateCcw className="size-3.5" aria-hidden="true" /> : <Archive className="size-3.5" aria-hidden="true" />}
        {archived ? "Unarchive" : "Archive"}
      </ConfirmButton>
    </form>
  );
}

export function PostsListView({ posts, page, pageSize, total }: { posts: readonly PostListRow[]; page: number; pageSize: number; total: number }) {
  return (
    <div className={tableWrap}>
      <table className={table}>
        <thead>
          <tr className={tableHeadRow}>
            <th className={tableHeadCell}>Title</th>
            <th className={tableHeadCell}>Topic</th>
            <th className={tableHeadCell}>Date</th>
            <th className={tableHeadCell}>Status</th>
            <th className={`${tableHeadCell} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody className={tableBody}>
          {posts.map((post) => (
            <tr key={post.id} className={tableRow}>
              <td className={tableCell}>
                <p className="min-w-56 font-bold text-brand-text">{post.title.trim() || "Untitled post"}</p>
              </td>
              <td className={tableCell}>
                <span className="text-brand-muted">{post.topic.trim() || "No topic"}</span>
              </td>
              <td className={`${tableCell} whitespace-nowrap`}>{post.dateLabel}</td>
              <td className={tableCell}>
                <StatusBadge status={post.status} />
              </td>
              <td className={tableCell}>
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/manage/posts/${post.id}`} className={iconButton} aria-label={`${post.title || "Untitled post"} edit`}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </Link>
                  <ArchivePostButton post={post} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={page} pageSize={pageSize} total={total} basePath="/manage/posts" />
    </div>
  );
}
