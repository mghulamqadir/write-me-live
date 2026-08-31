"use client";

import { useState } from "react";

export default function CopyRoomLink() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write fallback
    }
  }

  return (
    <button
      type="button"
      onClick={copyLink}
      className="theme-outline-button inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
      title="Copy invitation link to clipboard"
    >
      {copied ? (
        <>
          <svg className="size-3.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m5 13 4 4L19 7" />
          </svg>
          <span className="text-[var(--accent)]">Copied!</span>
        </>
      ) : (
        <>
          <svg className="size-3.5 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span>Share Room</span>
        </>
      )}
    </button>
  );
}
