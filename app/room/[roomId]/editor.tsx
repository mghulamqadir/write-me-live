"use client";

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

export default function Editor() {
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const liveblocks = useLiveblocksExtension({ collaborationMode: "yjs", field: "document" });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        bold: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        italic: false,
        listItem: false,
        orderedList: false,
        strike: false,
        undoRedo: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing together... Thoughts, outlines, drafts, or code notes sync in real-time.",
      }),
      liveblocks,
    ],
    onUpdate({ editor: currentEditor }) {
      const text = currentEditor.getText();
      setCharCount(text.length);
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      setWordCount(words);
    },
    editorProps: {
      attributes: {
        class: "min-h-[380px] sm:min-h-[460px] p-5 sm:p-7 outline-none text-[var(--text-primary)] leading-relaxed text-base font-normal",
      },
    },
  });

  async function handleCopyDocument() {
    if (!editor) return;
    const text = editor.getText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="w-full">
      {/* Editor Title Bar */}
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          LIVE DOCUMENT CANVAS
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            {wordCount} words · {charCount} chars
          </span>
        </div>
      </div>

      {/* Editor Main Container */}
      <div className="theme-editor rounded-2xl overflow-hidden transition-all duration-200 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_25px_-5px_color-mix(in_srgb,var(--accent)_20%,transparent)]">
        <EditorContent editor={editor} />

        {/* Editor Bottom Bar (Reference Style) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--bg-editor)] px-5 py-3">
          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
            <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">Real-time Yjs CRDT Synchronization</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyDocument}
              className="theme-outline-button inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium"
              title="Copy entire document text"
            >
              {copied ? (
                <>
                  <svg className="size-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
