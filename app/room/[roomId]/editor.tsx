"use client";

import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function Editor() {
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
      }),
      Placeholder.configure({ placeholder: "Start writing..." }),
      liveblocks,
    ],
    editorProps: {
      attributes: { class: "min-h-[420px] outline-none sm:min-h-[560px]" },
    },
  });

  return <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4 shadow-sm sm:px-8 sm:py-7"><EditorContent editor={editor} /></div>;
}
