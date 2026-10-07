"use client";

import { useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";

/** WYSIWYG editor. Paste from Google Docs / Word / websites keeps headings, bold, lists, links.
 *  The HTML goes into a hidden input, so the surrounding <form> sends it like any other field. */
export default function RichEditor({ name, initial = "" }: { name: string; initial?: string }) {
  const [html, setHtml] = useState(initial);
  const editor = useEditor({
    extensions: [StarterKit.configure({ link: { openOnClick: false } }), Image],
    content: initial,
    immediatelyRender: false, // Next renders on the server first; the editor only exists in the browser
    shouldRerenderOnTransaction: true, // keeps toolbar buttons' "active" state in sync
    editorProps: { attributes: { class: "blog-content min-h-80 px-4 py-3 outline-none" } },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="mt-1.5 rounded-xl border border-forest/20 bg-white font-normal text-ink focus-within:border-forest focus-within:ring-4 focus-within:ring-gold-soft/50">
      <input type="hidden" name={name} value={html} />
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const c = () => editor.chain().focus();
  const btn = (label: string, active: boolean, run: () => void) => (
    <button type="button" onClick={run} aria-pressed={active}
      className="rounded-lg px-2.5 py-1.5 text-sm font-semibold text-forest hover:bg-cream-deep aria-pressed:bg-forest aria-pressed:text-cream">
      {label}
    </button>
  );

  return (
    <div className="sticky top-0 z-10 flex flex-wrap gap-1 rounded-t-xl border-b border-forest/10 bg-white p-1.5">
      {btn("H2", editor.isActive("heading", { level: 2 }), () => c().toggleHeading({ level: 2 }).run())}
      {btn("H3", editor.isActive("heading", { level: 3 }), () => c().toggleHeading({ level: 3 }).run())}
      {btn("B", editor.isActive("bold"), () => c().toggleBold().run())}
      {btn("I", editor.isActive("italic"), () => c().toggleItalic().run())}
      {btn("U", editor.isActive("underline"), () => c().toggleUnderline().run())}
      {btn("• List", editor.isActive("bulletList"), () => c().toggleBulletList().run())}
      {btn("1. List", editor.isActive("orderedList"), () => c().toggleOrderedList().run())}
      {btn("Quote", editor.isActive("blockquote"), () => c().toggleBlockquote().run())}
      {btn("Link", editor.isActive("link"), () => {
        const href = prompt("Link URL (empty = remove link)", editor.getAttributes("link").href ?? "https://");
        if (href === null) return; // Cancel
        if (href) c().extendMarkRange("link").setLink({ href }).run();
        else c().extendMarkRange("link").unsetLink().run();
      })}
      {btn("Image", false, () => {
        const src = prompt("Image URL (e.g. /images/makhana.jpg or https://…)");
        if (src) c().setImage({ src, alt: prompt("Describe the image (for Google + screen readers)") ?? "" }).run();
      })}
      {btn("Undo", false, () => c().undo().run())}
      {btn("Redo", false, () => c().redo().run())}
    </div>
  );
}