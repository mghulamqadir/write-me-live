"use client";

import Link from "next/link";
import ConstellationBackground from "@/components/constellation-bg";
import ThemeSwitcher from "@/components/theme-switcher";

const messages: Record<string, { title: string; subtitle: string }> = {
  INVALID_ROOM_ID: {
    title: "Invalid Room Link",
    subtitle: "The provided room identifier is malformed or invalid.",
  },
  ROOM_NOT_FOUND: {
    title: "Room Not Found",
    subtitle: "This writing room does not exist or has expired.",
  },
  ROOM_FULL: {
    title: "Session Full",
    subtitle: "Write Me Live rooms support up to 2 active participants simultaneously.",
  },
  SERVER_CONFIG_ERROR: {
    title: "Configuration Error",
    subtitle: "We couldn’t connect because the server configuration is incomplete.",
  },
  CONNECTION_ERROR: {
    title: "Connection Lost",
    subtitle: "The realtime connection to this room was interrupted.",
  },
};

export default function RoomError({
  code = "CONNECTION_ERROR",
  roomId,
  message,
}: {
  code?: string;
  roomId?: string;
  message?: string;
}) {
  const errorInfo = messages[code] ?? messages.CONNECTION_ERROR;
  const isNotFound = code === "ROOM_NOT_FOUND";

  return (
    <main className="luxury-shell flex min-h-screen flex-col justify-between px-4 py-6 sm:px-8 sm:py-8">
      <ConstellationBackground />

      {/* Top Navigation Bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-2 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
            <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-bold tracking-tight text-emerald-400 text-base">Write Me</span>
              <span className="font-bold tracking-tight text-[var(--text-primary)] text-base">Live</span>
            </div>
            <p className="text-[10px] font-semibold tracking-widest text-[var(--text-muted)] mt-0.5">COLLABORATIVE WORKSPACE</p>
          </div>
        </Link>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeSwitcher />
        </div>
      </header>

      {/* Center Error Card */}
      <section className="glass-card relative z-10 mx-auto my-auto w-full max-w-md rounded-2xl p-6 text-center sm:p-8 shadow-2xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-red-950/40 text-red-400 border border-red-900/40 shadow-lg shadow-red-950/30">
          {isNotFound ? (
            <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          ) : (
            <svg className="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
        </div>

        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-5">
          {errorInfo.title}
        </h1>

        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed max-w-sm mx-auto">
          {message || errorInfo.subtitle}
        </p>

        {roomId ? (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-xs text-[var(--text-muted)]">
            <span>Room ID:</span>
            <span className="text-emerald-400 font-semibold">{roomId}</span>
          </div>
        ) : null}

        <div className="mt-7 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="theme-button flex-1 inline-flex h-11 items-center justify-center rounded-xl text-xs font-semibold tracking-wide"
          >
            Create a New Live Room →
          </Link>
          <Link
            href="/"
            className="theme-outline-button flex-1 inline-flex h-11 items-center justify-center rounded-xl text-xs font-medium tracking-wide"
          >
            Back to Workspace
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto text-center text-xs text-[var(--text-muted)] py-2">
        Write Me Live · Peer-to-peer collaborative writing workspace
      </footer>
    </main>
  );
}
