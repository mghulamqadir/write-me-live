"use client";

import { FormEvent, useState } from "react";
import ConstellationBackground from "@/components/constellation-bg";

export default function NamePrompt({ onComplete, onCancel }: { onComplete: () => void; onCancel?: () => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "Guest Writer" }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Please enter a valid name.");
      onComplete();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Please enter a valid name.");
      setIsSaving(false);
    }
  }

  return (
    <main className="luxury-shell flex min-h-screen items-center justify-center px-4 py-8">
      <ConstellationBackground />

      <form onSubmit={submit} className="glass-card relative z-10 w-full max-w-md rounded-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              Writer Identity
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">Choose your display name for this room</p>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="room-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
            YOUR DISPLAY NAME
          </label>
          <input
            id="room-name"
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={40}
            placeholder="e.g. Co-Author or Ayesha..."
            className="theme-input mt-2 h-12 w-full rounded-xl px-4 text-sm font-medium outline-none"
          />
          {error ? <p className="theme-error mt-2 text-xs font-medium" role="alert">{error}</p> : null}
        </div>

        <div className="mt-6 flex gap-3">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="theme-outline-button h-11 flex-1 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
          ) : null}
          <button
            type="submit"
            disabled={isSaving}
            className="theme-button flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-xs font-semibold tracking-wide disabled:opacity-60"
          >
            {isSaving ? "Joining…" : "Join Live Room →"}
          </button>
        </div>
      </form>
    </main>
  );
}
