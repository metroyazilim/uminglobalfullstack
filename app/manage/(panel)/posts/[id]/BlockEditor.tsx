"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { MediaField } from "@/components/admin/MediaField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { fieldInput, fieldLabel, fieldTextarea, iconButton, secondaryButton } from "@/components/admin/ui";

export type Block =
  | { kind: "lead"; text: string }
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; text: string }
  | { kind: "image"; src: string; alt: string; caption?: string };

export type BlockEditorProps = { value: Block[]; onChange: (value: Block[]) => void };

const KIND_LABELS: Record<Block["kind"], string> = {
  lead: "Lead paragraph",
  p: "Paragraph",
  h2: "Subheading (H2)",
  list: "List",
  callout: "Callout",
  image: "Image",
};

function emptyBlock(kind: Block["kind"]): Block {
  if (kind === "list") return { kind, items: [""] };
  if (kind === "image") return { kind, src: "", alt: "", caption: "" };
  return { kind, text: "" };
}

export function BlockEditor({ value, onChange }: BlockEditorProps) {
  const replaceBlock = (index: number, block: Block) => onChange(value.map((current, currentIndex) => currentIndex === index ? block : current));
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name="body" value={JSON.stringify(value)} />
      {value.map((block, index) => (
        <div key={index} className="border border-brand-border bg-brand-surface p-3">
          <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
            <label className="min-w-44 flex-1">
              <span className={fieldLabel}>Block type</span>
              <select value={block.kind} onChange={(event) => replaceBlock(index, emptyBlock(event.target.value as Block["kind"]))} className={fieldInput}>
                {(Object.keys(KIND_LABELS) as Block["kind"][]).map((kind) => <option key={kind} value={kind}>{KIND_LABELS[kind]}</option>)}
              </select>
            </label>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className={`${iconButton} rounded-none disabled:cursor-not-allowed disabled:opacity-30`} aria-label="Move block up"><ArrowUp className="size-4" aria-hidden="true" /></button>
              <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === value.length - 1} className={`${iconButton} rounded-none disabled:cursor-not-allowed disabled:opacity-30`} aria-label="Move block down"><ArrowDown className="size-4" aria-hidden="true" /></button>
              <button type="button" onClick={() => onChange(value.filter((_, currentIndex) => currentIndex !== index))} className={`${iconButton} rounded-none`} aria-label="Remove block"><Trash2 className="size-4" aria-hidden="true" /></button>
            </div>
          </div>

          {block.kind === "list" ? (
            <div className="space-y-2">
              {block.items.map((item, itemIndex) => <div key={itemIndex} className="flex items-start gap-2"><input value={item} onChange={(event) => replaceBlock(index, { kind: "list", items: block.items.map((current, currentIndex) => currentIndex === itemIndex ? event.target.value : current) })} className={fieldInput} placeholder="List item" /><button type="button" onClick={() => replaceBlock(index, { kind: "list", items: block.items.filter((_, currentIndex) => currentIndex !== itemIndex) })} className={`${iconButton} mt-1.5 shrink-0 rounded-none`} aria-label="Remove list item"><Trash2 className="size-4" aria-hidden="true" /></button></div>)}
              <button type="button" onClick={() => replaceBlock(index, { kind: "list", items: [...block.items, ""] })} className={`${secondaryButton} rounded-none`}><Plus className="size-3.5" aria-hidden="true" />Add item</button>
            </div>
          ) : block.kind === "h2" ? (
            <textarea value={block.text} onChange={(event) => replaceBlock(index, { kind: block.kind, text: event.target.value })} rows={2} className={`${fieldTextarea} rounded-none`} placeholder="Subheading (H2)" />
          ) : block.kind === "image" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <MediaField name={`block-image-${index}`} label="Image" value={block.src} onChange={({ url, altText }) => replaceBlock(index, { ...block, src: url, alt: block.alt || altText || "" })} description="Choose an image from Media Library or upload one in the picker." />
              <div className="space-y-3">
                <label className={fieldLabel}>Alt text<input value={block.alt} onChange={(event) => replaceBlock(index, { ...block, alt: event.target.value })} className={fieldInput} /></label>
                <label className={fieldLabel}>Caption<input value={block.caption ?? ""} onChange={(event) => replaceBlock(index, { ...block, caption: event.target.value })} className={fieldInput} /></label>
              </div>
            </div>
          ) : (
            <RichTextEditor value={block.text} onChange={(html) => replaceBlock(index, { ...block, text: html })} />
          )}
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, { kind: "p", text: "" }])} className={`${secondaryButton} rounded-none`}><Plus className="size-4" aria-hidden="true" />Add block</button>
    </div>
  );
}
