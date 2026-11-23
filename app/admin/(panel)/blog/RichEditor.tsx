"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";

/** Upload one image file and return its address (or null if it was rejected). */
async function uploadImage(file: File): Promise<string | null> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/blog-images", { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert(data.error ?? "Upload failed. Please try again.");
    return null;
  }
  return data.url as string;
}

/** WordPress-style editor. Paste from Google Docs / Word / websites keeps formatting; images can be uploaded,
 *  pasted or dropped in. The HTML goes into a hidden input, so the form sends it like a textarea. */
export default function RichEditor({ name, initial = "" }: { name: string; initial?: string }) {
  const [html, setHtml] = useState(initial);
  const editorRef = useRef<Editor | null>(null);

  const insertImages = async (files: File[]) => {
    const editor = editorRef.current;
    if (!editor) return;
    for (const file of files) {
      const url = await uploadImage(file);
      if (url) editor.chain().focus().setImage({ src: url, alt: file.name.replace(/\.[^.]+$/, "") }).run();
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: { openOnClick: false } }),
      Image.configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: initial,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: { class: "blog-content min-h-80 px-4 py-3 outline-none" },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (!files.length) return false; // plain text / HTML paste: let the editor handle it
        event.preventDefault();
        insertImages(files);
        return true;
      },
      handleDrop: (_view, event) => {
        const files = Array.from((event as DragEvent).dataTransfer?.files ?? []).filter((f) => f.type.startsWith("image/"));
        if (!files.length) return false;
        event.preventDefault();
        insertImages(files);
        return true;
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });
  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  return (
    <div className="mt-1.5 rounded-xl border border-forest/20 bg-white font-normal text-ink focus-within:border-forest focus-within:ring-4 focus-within:ring-gold-soft/50">
      <input type="hidden" name={name} value={html} />
      {editor && <Toolbar editor={editor} name={name} onImage={insertImages} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, name, onImage }: { editor: Editor; name: string; onImage: (files: File[]) => void }) {
  const c = () => editor.chain().focus();

  const btn = (label: string, active: boolean, run: () => void, title = label) => (
    <button type="button" onClick={run} aria-pressed={active} title={title} aria-label={title}
      className="min-w-8 rounded-lg px-2 py-1.5 text-sm font-semibold text-forest hover:bg-cream-deep aria-pressed:bg-forest aria-pressed:text-cream">
      {label}
    </button>
  );
  const sep = <span aria-hidden className="mx-1 w-px self-stretch bg-forest/15" />;

  const setLink = () => {
    const href = prompt("Link URL (empty = remove link)", editor.getAttributes("link").href ?? "https://");
    if (href === null) return;
    if (href) c().extendMarkRange("link").setLink({ href }).run();
    else c().extendMarkRange("link").unsetLink().run();
  };

  const inTable = editor.isActive("table");

  return (
    <div className="sticky top-0 z-10 rounded-t-xl border-b border-forest/10 bg-white">
      <div className="flex flex-wrap items-center gap-1 p-1.5">
        {btn("P", editor.isActive("paragraph"), () => c().setParagraph().run(), "Paragraph")}
        {btn("H2", editor.isActive("heading", { level: 2 }), () => c().toggleHeading({ level: 2 }).run(), "Heading 2")}
        {btn("H3", editor.isActive("heading", { level: 3 }), () => c().toggleHeading({ level: 3 }).run(), "Heading 3")}
        {sep}
        {btn("B", editor.isActive("bold"), () => c().toggleBold().run(), "Bold")}
        {btn("I", editor.isActive("italic"), () => c().toggleItalic().run(), "Italic")}
        {btn("U", editor.isActive("underline"), () => c().toggleUnderline().run(), "Underline")}
        {btn("S", editor.isActive("strike"), () => c().toggleStrike().run(), "Strikethrough")}
        <label title="Text colour" className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-forest hover:bg-cream-deep">
          A<input type="color" aria-label="Text colour" className="size-5 cursor-pointer border-0 bg-transparent p-0"
            onChange={(e) => c().setColor(e.target.value).run()} />
        </label>
        <label title="Highlight colour" className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-forest hover:bg-cream-deep">
          ▮<input type="color" defaultValue="#fff3a3" aria-label="Highlight colour" className="size-5 cursor-pointer border-0 bg-transparent p-0"
            onChange={(e) => c().setHighlight({ color: e.target.value }).run()} />
        </label>
        {btn("✕", false, () => c().unsetColor().unsetHighlight().run(), "Remove colour and highlight")}
        {sep}
        {btn("⇤", editor.isActive({ textAlign: "left" }), () => c().setTextAlign("left").run(), "Align left")}
        {btn("≡", editor.isActive({ textAlign: "center" }), () => c().setTextAlign("center").run(), "Align centre")}
        {btn("⇥", editor.isActive({ textAlign: "right" }), () => c().setTextAlign("right").run(), "Align right")}
        {btn("☰", editor.isActive({ textAlign: "justify" }), () => c().setTextAlign("justify").run(), "Justify")}
        {sep}
        {btn("• List", editor.isActive("bulletList"), () => c().toggleBulletList().run(), "Bulleted list")}
        {btn("1. List", editor.isActive("orderedList"), () => c().toggleOrderedList().run(), "Numbered list")}
        {btn("❝", editor.isActive("blockquote"), () => c().toggleBlockquote().run(), "Quote")}
        {btn("</>", editor.isActive("codeBlock"), () => c().toggleCodeBlock().run(), "Code block")}
        {btn("—", false, () => c().setHorizontalRule().run(), "Horizontal line")}
        {btn("Link", editor.isActive("link"), setLink, "Link")}
        {btn("Table", inTable, () => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), "Insert table")}
        {btn("Image", false, () => document.getElementById(`image-input-${name}`)?.click(), "Upload image")}
        <input id={`image-input-${name}`} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
          onChange={(e) => { onImage(Array.from(e.target.files ?? [])); e.target.value = ""; }} />
        {btn("Alt", false, () => {
          const alt = prompt("Describe this image (for Google and screen readers)", editor.getAttributes("image").alt ?? "");
          if (alt !== null) c().updateAttributes("image", { alt }).run();
        }, "Edit selected image's description")}
        {sep}
        {btn("↶", false, () => c().undo().run(), "Undo")}
        {btn("↷", false, () => c().redo().run(), "Redo")}
      </div>

      {inTable && (
        <div className="flex flex-wrap items-center gap-1 border-t border-forest/10 bg-cream/60 p-1.5 text-xs font-semibold text-forest">
          <span className="px-1 text-ink-muted">Table:</span>
          {btn("+ Row", false, () => c().addRowAfter().run(), "Add row below")}
          {btn("+ Column", false, () => c().addColumnAfter().run(), "Add column to the right")}
          {btn("− Row", false, () => c().deleteRow().run(), "Delete row")}
          {btn("− Column", false, () => c().deleteColumn().run(), "Delete column")}
          {btn("Header row", false, () => c().toggleHeaderRow().run(), "Make the top row a header")}
          {btn("Merge", false, () => c().mergeCells().run(), "Merge selected cells")}
          {btn("Split", false, () => c().splitCell().run(), "Split cell")}
          {btn("Delete table", false, () => c().deleteTable().run(), "Delete table")}
        </div>
      )}
    </div>
  );
}
