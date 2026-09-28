"use client";

import { Link as LinkIcon, List, ListOrdered, Bold, Italic } from "lucide-react";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { cn, fieldLabel, iconButton } from "@/components/admin/ui";

type UncontrolledRichTextEditorProps = {
  name: string;
  defaultValue?: string;
  label?: string;
  value?: never;
  onChange?: never;
};

type ControlledRichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  name?: never;
  defaultValue?: never;
};

type RichTextEditorProps = UncontrolledRichTextEditorProps | ControlledRichTextEditorProps;

type ToolbarState = {
  bold: boolean;
  italic: boolean;
  bulletList: boolean;
  orderedList: boolean;
  link: boolean;
};

const EMPTY_TOOLBAR_STATE: ToolbarState = {
  bold: false,
  italic: false,
  bulletList: false,
  orderedList: false,
  link: false,
};

function readToolbarState(editor: Editor): ToolbarState {
  return {
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    bulletList: editor.isActive("bulletList"),
    orderedList: editor.isActive("orderedList"),
    link: editor.isActive("link"),
  };
}

export function RichTextEditor(props: RichTextEditorProps) {
  const controlled = "value" in props;
  const currentOnChange = controlled ? props.onChange : undefined;
  const controlledOnChange = useRef<((html: string) => void) | undefined>(currentOnChange);
  useEffect(() => {
    controlledOnChange.current = currentOnChange;
  }, [currentOnChange]);

  const initialContent = controlled ? props.value : (props.defaultValue ?? "");
  const [formValue, setFormValue] = useState(initialContent);
  const [toolbarState, setToolbarState] = useState(EMPTY_TOOLBAR_STATE);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: false, link: false }),
      Link.configure({ openOnClick: false }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-28 px-3 py-2 text-sm leading-6 text-brand-text outline-none [&_a]:text-brand-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-brand-border [&_blockquote]:pl-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-6",
        "aria-label": props.label ?? "Rich text editor",
      },
    },
    onCreate: ({ editor: currentEditor }) => setToolbarState(readToolbarState(currentEditor)),
    onSelectionUpdate: ({ editor: currentEditor }) => setToolbarState(readToolbarState(currentEditor)),
    onTransaction: ({ editor: currentEditor }) => setToolbarState(readToolbarState(currentEditor)),
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      if (controlled) controlledOnChange.current?.(html);
      else setFormValue(html);
    },
  });

  const controlledValue = controlled ? props.value : undefined;
  useEffect(() => {
    if (!editor || controlledValue === undefined || editor.getHTML() === controlledValue) return;
    editor.commands.setContent(controlledValue, { emitUpdate: false });
  }, [controlledValue, editor]);

  function editLink() {
    if (!editor) return;
    const currentHref = editor.getAttributes("link").href as string | undefined;
    const href = window.prompt("Enter a link URL", currentHref ?? "https://");
    if (href === null) return;

    if (href.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: href.trim() }).run();
  }

  return (
    <div>
      {props.label ? <span className={fieldLabel}>{props.label}</span> : null}
      {!controlled ? <input type="hidden" name={props.name} value={formValue} /> : null}
      <div className="mt-1.5 overflow-hidden rounded-none border border-brand-border bg-brand-surface focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/10">
        <div className="flex flex-wrap items-center gap-1 border-b border-brand-border bg-brand-muted-surface/50 p-1">
          <button
            type="button"
            className={cn(iconButton, toolbarState.bold && "bg-brand-muted-surface text-brand-primary")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor}
            aria-label="Bold"
            aria-pressed={toolbarState.bold}
          >
            <Bold className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn(iconButton, toolbarState.italic && "bg-brand-muted-surface text-brand-primary")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor}
            aria-label="Italic"
            aria-pressed={toolbarState.italic}
          >
            <Italic className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn(iconButton, toolbarState.bulletList && "bg-brand-muted-surface text-brand-primary")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor}
            aria-label="Bullet list"
            aria-pressed={toolbarState.bulletList}
          >
            <List className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn(iconButton, toolbarState.orderedList && "bg-brand-muted-surface text-brand-primary")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor}
            aria-label="Ordered list"
            aria-pressed={toolbarState.orderedList}
          >
            <ListOrdered className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={cn(iconButton, toolbarState.link && "bg-brand-muted-surface text-brand-primary")}
            onClick={editLink}
            disabled={!editor}
            aria-label="Link"
            aria-pressed={toolbarState.link}
          >
            <LinkIcon className="size-4" aria-hidden="true" />
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
