"use client";

import Link from "next/link";
import ConstellationBackground from "@/components/constellation-bg";

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

export default function RoomError({ code = "CONNECTION_ERROR" }: { code?: string }) {
  const errorInfo = messages[code] ?? messages.CONNECTION_ERROR;

  return (
    <main className="luxury-shell flex min-h-screen items-center justify-center px-4 py-8">
      <ConstellationBackground />

      <section className="glass-card relative z-10 w-full max-w-md rounded-2xl p-6 text-center sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-red-950/40 text-red-400 border border-red-900/40 shadow-lg">
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)] mt-4">
          {errorInfo.title}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
          {errorInfo.subtitle}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/"
            className="theme-button inline-flex h-11 items-center justify-center rounded-xl text-xs font-semibold tracking-wide"
          >
            Create a New Live Room →
          </Link>
        </div>
      </section>
    </main>
  );
}
