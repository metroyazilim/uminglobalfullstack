"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { PageBlock } from "@/lib/content/page-content";
import { PAGE_BLOCK_KIND_LABELS } from "@/lib/content/page-content";
import { fieldInput, fieldLabel, fieldTextarea, iconButton, secondaryButton } from "@/components/admin/ui";

const BLOCK_KINDS = ["hero", "heading", "paragraph", "list", "cards", "stats", "image", "cta"] as const;
type BlockKind = (typeof BLOCK_KINDS)[number];

function emptyBlock(kind: BlockKind): PageBlock {
  switch (kind) {
    case "hero": return { kind, title: "", eyebrow: "", body: "" };
    case "heading": return { kind, title: "", eyebrow: "", lead: "" };
    case "paragraph": return { kind, text: "" };
    case "list": return { kind, title: "", items: [""] };
    case "cards": return { kind, title: "", items: [{ title: "", text: "" }] };
    case "stats": return { kind, items: [{ value: "", label: "" }] };
    case "image": return { kind, src: "", alt: "", caption: "" };
    case "cta": return { kind, title: "", text: "", label: "", href: "" };
  }
}

function TextField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="block">
      <span className={fieldLabel}>{label}</span>
      {multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} className={fieldTextarea} rows={4} /> : <input value={value} onChange={(event) => onChange(event.target.value)} className={fieldInput} />}
    </label>
  );
}

export function PageBlockEditor({ initialValue, name = "blocks" }: { initialValue: PageBlock[]; name?: string }) {
  const [blocks, setBlocks] = useState<PageBlock[]>(initialValue);
  const replace = (index: number, block: PageBlock) => setBlocks((current) => current.map((item, itemIndex) => itemIndex === index ? block : item));
  const remove = (index: number) => setBlocks((current) => current.filter((_, itemIndex) => itemIndex !== index));
  const move = (index: number, direction: -1 | 1) => setBlocks((current) => {
    const target = index + direction;
    if (target < 0 || target >= current.length) return current;
    const next = [...current];
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(blocks)} />
      {blocks.length === 0 ? <p className="rounded border border-dashed border-brand-border p-5 text-sm text-brand-muted">Henüz blok yok. Aşağıdan bir blok ekleyin.</p> : null}
      {blocks.map((block, index) => (
        <section key={`${block.kind}-${index}`} className="rounded border border-brand-border bg-brand-surface p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-bold text-brand-ink">{index + 1}. {PAGE_BLOCK_KIND_LABELS[block.kind]}</h3>
            <div className="flex gap-1">
              <button type="button" className={iconButton} onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move block up"><ArrowUp className="size-4" /></button>
              <button type="button" className={iconButton} onClick={() => move(index, 1)} disabled={index === blocks.length - 1} aria-label="Move block down"><ArrowDown className="size-4" /></button>
              <button type="button" className={iconButton} onClick={() => remove(index)} aria-label="Delete block"><Trash2 className="size-4" /></button>
            </div>
          </div>
          {block.kind === "hero" ? <div className="grid gap-4 sm:grid-cols-2"><TextField label="Eyebrow" value={block.eyebrow ?? ""} onChange={(value) => replace(index, { ...block, eyebrow: value })} /><TextField label="Title" value={block.title} onChange={(value) => replace(index, { ...block, title: value })} /><div className="sm:col-span-2"><TextField label="Body" value={block.body ?? ""} onChange={(value) => replace(index, { ...block, body: value })} multiline /></div></div> : null}
          {block.kind === "heading" ? <div className="grid gap-4 sm:grid-cols-2"><TextField label="Eyebrow" value={block.eyebrow ?? ""} onChange={(value) => replace(index, { ...block, eyebrow: value })} /><TextField label="Title" value={block.title} onChange={(value) => replace(index, { ...block, title: value })} /><div className="sm:col-span-2"><TextField label="Lead" value={block.lead ?? ""} onChange={(value) => replace(index, { ...block, lead: value })} multiline /></div></div> : null}
          {block.kind === "paragraph" ? <TextField label="Paragraph" value={block.text} onChange={(value) => replace(index, { ...block, text: value })} multiline /> : null}
          {block.kind === "list" ? <div className="space-y-4"><TextField label="Title" value={block.title ?? ""} onChange={(value) => replace(index, { ...block, title: value })} />{block.items.map((item, itemIndex) => <TextField key={itemIndex} label={`Item ${itemIndex + 1}`} value={item} onChange={(value) => replace(index, { ...block, items: block.items.map((current, currentIndex) => currentIndex === itemIndex ? value : current) })} />)}<button type="button" className={secondaryButton} onClick={() => replace(index, { ...block, items: [...block.items, ""] })}>Add item</button></div> : null}
          {block.kind === "cards" ? <div className="space-y-4"><TextField label="Title" value={block.title ?? ""} onChange={(value) => replace(index, { ...block, title: value })} />{block.items.map((item, itemIndex) => <div key={itemIndex} className="grid gap-3 rounded border border-brand-border p-3 sm:grid-cols-2"><TextField label={`Card ${itemIndex + 1} title`} value={item.title} onChange={(value) => replace(index, { ...block, items: block.items.map((current, currentIndex) => currentIndex === itemIndex ? { ...current, title: value } : current) })} /><TextField label="Text" value={item.text} onChange={(value) => replace(index, { ...block, items: block.items.map((current, currentIndex) => currentIndex === itemIndex ? { ...current, text: value } : current) })} multiline /></div>)}<button type="button" className={secondaryButton} onClick={() => replace(index, { ...block, items: [...block.items, { title: "", text: "" }] })}>Add card</button></div> : null}
          {block.kind === "stats" ? <div className="space-y-4">{block.items.map((item, itemIndex) => <div key={itemIndex} className="grid gap-3 sm:grid-cols-2"><TextField label={`Value ${itemIndex + 1}`} value={item.value} onChange={(value) => replace(index, { ...block, items: block.items.map((current, currentIndex) => currentIndex === itemIndex ? { ...current, value } : current) })} /><TextField label="Label" value={item.label} onChange={(label) => replace(index, { ...block, items: block.items.map((current, currentIndex) => currentIndex === itemIndex ? { ...current, label } : current) })} /></div>)}<button type="button" className={secondaryButton} onClick={() => replace(index, { ...block, items: [...block.items, { value: "", label: "" }] })}>Add stat</button></div> : null}
          {block.kind === "image" ? <div className="grid gap-4 sm:grid-cols-2"><TextField label="Image URL" value={block.src} onChange={(value) => replace(index, { ...block, src: value })} /><TextField label="Alt text" value={block.alt} onChange={(value) => replace(index, { ...block, alt: value })} /><div className="sm:col-span-2"><TextField label="Caption" value={block.caption ?? ""} onChange={(value) => replace(index, { ...block, caption: value })} /></div></div> : null}
          {block.kind === "cta" ? <div className="grid gap-4 sm:grid-cols-2"><TextField label="Title" value={block.title} onChange={(value) => replace(index, { ...block, title: value })} /><TextField label="Button label" value={block.label} onChange={(value) => replace(index, { ...block, label: value })} /><TextField label="URL" value={block.href} onChange={(value) => replace(index, { ...block, href: value })} /><TextField label="Text" value={block.text ?? ""} onChange={(value) => replace(index, { ...block, text: value })} multiline /></div> : null}
        </section>
      ))}
      <div className="flex flex-wrap gap-2">
        {BLOCK_KINDS.map((kind) => <button key={kind} type="button" className={secondaryButton} onClick={() => setBlocks((current) => [...current, emptyBlock(kind)])}><Plus className="size-4" />{PAGE_BLOCK_KIND_LABELS[kind]}</button>)}
      </div>
    </div>
  );
}
