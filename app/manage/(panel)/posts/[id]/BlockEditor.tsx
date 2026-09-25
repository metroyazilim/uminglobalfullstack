"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { card, fieldInput, fieldLabel, fieldTextarea, iconButton, secondaryButton } from "@/components/admin/ui";

export type Block =
  | { kind: "lead"; text: string }
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; text: string };

export type BlockEditorProps = {
  value: Block[];
  onChange: (value: Block[]) => void;
};

const KIND_LABELS: Record<Block["kind"], string> = {
  lead: "Lead paragraph",
  p: "Paragraph",
  h2: "Subheading (H2)",
  list: "List",
  callout: "Callout",
};

function emptyBlock(kind: Block["kind"]): Block {
  if (kind === "list") return { kind, items: [""] };
  return { kind, text: "" };
}

export function BlockEditor({ value, onChange }: BlockEditorProps) {
  const replaceBlock = (index: number, block: Block) => {
    onChange(value.map((current, currentIndex) => (currentIndex === index ? block : current)));
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const removeBlock = (index: number) => {
    onChange(value.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="space-y-3">
      <input type="hidden" name="body" value={JSON.stringify(value)} />

      {value.map((block, index) => (
        <div key={index} className={`${card} p-4`}>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <label className="min-w-44 flex-1">
              <span className={fieldLabel}>Block type</span>
              <select
                value={block.kind}
                onChange={(event) => replaceBlock(index, emptyBlock(event.target.value as Block["kind"]))}
                className={fieldInput}
              >
                {(Object.keys(KIND_LABELS) as Block["kind"][]).map((kind) => (
                  <option key={kind} value={kind}>
                    {KIND_LABELS[kind]}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className={`${iconButton} disabled:cursor-not-allowed disabled:opacity-30`} aria-label="Move block up">
                <ArrowUp className="size-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === value.length - 1} className={`${iconButton} disabled:cursor-not-allowed disabled:opacity-30`} aria-label="Move block down">
                <ArrowDown className="size-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => removeBlock(index)} className={iconButton} aria-label="Remove block">
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {block.kind === "list" ? (
            <div className="space-y-2">
              {block.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-2">
                  <input
                    value={item}
                    onChange={(event) => {
                      const items = block.items.map((current, currentIndex) => (currentIndex === itemIndex ? event.target.value : current));
                      replaceBlock(index, { kind: "list", items });
                    }}
                    className={fieldInput}
                    placeholder="List item"
                  />
                  <button
                    type="button"
                    onClick={() => replaceBlock(index, { kind: "list", items: block.items.filter((_, currentIndex) => currentIndex !== itemIndex) })}
                    className={`${iconButton} mt-1.5 shrink-0`}
                    aria-label="Remove list item"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => replaceBlock(index, { kind: "list", items: [...block.items, ""] })} className={secondaryButton}>
                <Plus className="size-3.5" aria-hidden="true" />
                Add item
              </button>
            </div>
          ) : block.kind === "h2" ? (
            <label>
              <span className="sr-only">{KIND_LABELS[block.kind]} content</span>
              <textarea
                value={block.text}
                onChange={(event) => replaceBlock(index, { kind: block.kind, text: event.target.value })}
                rows={2}
                className={fieldTextarea}
                placeholder="Subheading (H2)"
              />
            </label>
          ) : (
            <RichTextEditor
              value={block.text}
              onChange={(html) => replaceBlock(index, { ...block, text: html })}
            />
          )}
        </div>
      ))}

      <button type="button" onClick={() => onChange([...value, { kind: "p", text: "" }])} className={secondaryButton}>
        <Plus className="size-4" aria-hidden="true" />
        Add block
      </button>
    </div>
  );
}
