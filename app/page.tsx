"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ThemeSwitcher from "@/components/theme-switcher";
import ConstellationBackground from "@/components/constellation-bg";

async function saveName(name: string) {
  const response = await fetch("/api/identity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  const result = (await response.json()) as { ok?: boolean; message?: string };
  if (!response.ok || !result.ok) throw new Error(result.message ?? "Please enter a valid name.");
}

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [writerRole, setWriterRole] = useState<"host" | "collaborator">("host");

  async function createRoom() {
    setIsCreating(true);
    setError(null);

    try {
      await saveName(name || "Host Writer");
      const response = await fetch("/api/rooms", { method: "POST" });
      const result = (await response.json()) as { roomId?: string; message?: string };
      if (!response.ok || !result.roomId) throw new Error(result.message ?? "Unable to create a room.");
      router.push(`/room/${result.roomId}`);
    } catch (creationError) {
      setError(creationError instanceof Error ? creationError.message : "Unable to create a room.");
      setIsCreating(false);
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await createRoom();
  }

  return (
    <main className="luxury-shell flex min-h-screen flex-col justify-between px-4 py-6 sm:px-8 sm:py-8">
      <ConstellationBackground />

      {/* Top Navigation Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-2 shadow-lg shadow-emerald-950/50">
            <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold tracking-tight text-emerald-400 text-base">WriteMe</span>
              <span className="font-bold tracking-tight text-[var(--text-primary)] text-base">Live</span>
            </div>
            <p className="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] mt-0.5">COLLABORATIVE WORKSPACE</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="status-badge-active hidden sm:inline-flex">
            <span className="pulse-dot" />
            <span>Ready for Sessions</span>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto my-auto w-full max-w-3xl py-8">
        {/* Center Hero Heading */}
        <div className="text-center mb-8">
          <h1 className="hero-heading flex items-center justify-center gap-2.5">
            <span className="brand-gradient">WriteMe</span>
            <span className="text-[var(--text-primary)]">Live</span>
          </h1>
          <p className="theme-subtitle mx-auto mt-3 max-w-lg text-sm sm:text-base font-normal">
            Real-time, two-person collaborative writing with instant sync and zero signups.
          </p>
        </div>

        {/* Main Composer Card (Reference Style) */}
        <form onSubmit={submit} className="glass-card rounded-2xl p-6 sm:p-8">
          {/* Card Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Session Composer</h2>
                <p className="text-xs text-[var(--text-secondary)]">Create a private space and invite your co-writer</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
              <svg className="size-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>2-Person Room</span>
            </div>
          </div>

          {/* Role / Session Type Selection (Segmented Cards) */}
          <div className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              WRITER PROFILE
            </label>
            <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setWriterRole("host")}
                className={`segmented-card ${writerRole === "host" ? "is-active" : ""}`}
              >
                <div className="custom-radio">
                  <span className="custom-radio-dot" />
                </div>
                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" x2="19" y1="8" y2="14" />
                    <line x1="22" x2="16" y1="11" y2="11" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-semibold leading-tight ${writerRole === "host" ? "text-emerald-400" : "text-[var(--text-primary)]"}`}>
                    Lead Author
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Primary host / Room creator</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setWriterRole("collaborator")}
                className={`segmented-card ${writerRole === "collaborator" ? "is-active" : ""}`}
              >
                <div className="custom-radio">
                  <span className="custom-radio-dot" />
                </div>
                <div className="flex size-7 items-center justify-center rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-semibold leading-tight ${writerRole === "collaborator" ? "text-emerald-400" : "text-[var(--text-primary)]"}`}>
                    Collaborative Pair
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Peer editing & brainstorming</p>
                </div>
              </button>
            </div>
          </div>

          {/* Name Input */}
          <div className="mt-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]" htmlFor="display-name">
              DISPLAY NAME
            </label>
            <input
              id="display-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              placeholder="e.g. Ayesha or Lead Writer..."
              className="theme-input mt-2 h-12 w-full rounded-xl px-4 text-sm font-medium outline-none"
            />
          </div>

          {error ? <p className="theme-error mt-3 text-xs font-medium">{error}</p> : null}

          {/* Action Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isCreating}
              className="theme-button flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold tracking-wide disabled:opacity-60"
            >
              {isCreating ? (
                <>
                  <span className="loading-orbit !size-4 border-white/40 border-t-white" />
                  <span>Creating Session…</span>
                </>
              ) : (
                <>
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                  <span>Launch Live Room</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto text-center text-xs text-[var(--text-muted)] py-2">
        WriteMe Live · Peer-to-peer collaborative writing workspace
      </footer>
    </main>
  );
}
