"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { FiBold, FiItalic, FiLink, FiList, FiImage } from "react-icons/fi";

const TipTapEditor = ({ content = "", onChange }) => {
  const [isMounted, setIsMounted] = useState(false);

  // ✅ Mark component as mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Only create editor when mounted (no conditional hook order)
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({
        placeholder: "Start writing your content...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // ✅ Avoid rendering during SSR
  if (!isMounted || !editor) {
    return (
      <div className="w-full min-h-[120px] p-3 border border-[var(--border-color)] rounded-md bg-[var(--container-color-in)] text-[var(--text-color)] text-sm">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="w-full border border-[var(--border-color)] bg-[var(--container-color-in)] rounded-md shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] p-2 bg-[var(--container-color-in)] rounded-t-md">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("bold") ? "bg-[var(--button-bg-color)] text-[var(--button-color)]" : ""
          }`}
          title="Bold"
        >
          <FiBold />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("italic") ? "bg-[var(--button-bg-color)] text-[var(--button-color)]" : ""
          }`}
          title="Italic"
        >
          <FiItalic />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("underline") ? "bg-[var(--button-bg-color)] text-[var(--button-color)]" : ""
          }`}
          title="Underline"
        >
          U
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("strike") ? "bg-[var(--button-bg-color)] text-[var(--button-color)]" : ""
          }`}
          title="Strikethrough"
        >
          S
        </button>

        {/* Headings */}
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level }).run()
            }
            className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
              editor.isActive("heading", { level })
                ? "bg-[var(--button-bg-color)] text-[var(--button-color)]"
                : ""
            }`}
            title={`Heading ${level}`}
          >
            H{level}
          </button>
        ))}

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("bulletList") ? "bg-[var(--button-bg-color)] text-[var(--button-color)]" : ""
          }`}
          title="Bullet List"
        >
          <FiList />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("orderedList") ? "bg-[var(--button-bg-color)] text-[var(--button-color)]" : ""
          }`}
          title="Ordered List"
        >
          <FiList className="rotate-90" />
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("blockquote") ? "bg-[var(--button-bg-color)] text-[var(--button-color)]" : ""
          }`}
          title="Blockquote"
        >
          “ ”
        </button>

        {/* Code */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("codeBlock") ? "bg-[var(--button-bg-color)] text-[var(--button-color)] text-[var(--button-color)]" : ""
          }`}
          title="Code Block"
        >
          {"</>"}
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)]"
          title="Horizontal Rule"
        >
          ―
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("URL", previousUrl);
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
          className={`p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)] ${
            editor.isActive("link") ? "bg-[var(--button-bg-color)] text-[var(--button-color)]" : ""
          }`}
          title="Link"
        >
          <FiLink />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className="p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)]"
          title="Image"
        >
          <FiImage />
        </button>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          className="p-2 rounded hover:text-[var(--button-color)] hover:bg-[var(--button-hover-color)]"
          title="Clear Formatting"
        >
          ✕
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="
          p-1
          border border-[var(--border-color)]
          rounded-md
          bg-[var(--container-color)]
          focus-within:ring-2 focus-within:ring-[var(--accent-color)]
          [&_.ProseMirror]:min-h-[250px]
          [&_.ProseMirror]:p-3
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:text-[var(--text-color)]
          [&_.ProseMirror]:bg-[var(--container-color)]
          [&_.ProseMirror]:rounded-md
        "
      />
    </div>
  );
};

export default TipTapEditor;
