"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { useState } from "react";
import ConnectionStatus from "@/components/connection-status";
import CopyRoomLink from "@/components/copy-room-link";
import NamePrompt from "@/components/name-prompt";
import ThemeSwitcher from "@/components/theme-switcher";
import ConstellationBackground from "@/components/constellation-bg";
import { LiveblocksProvider, RoomProvider, useErrorListener } from "@/liveblocks.config";
import Editor from "./editor";
import Presence from "./presence";
import RoomError from "./room-error";
import Link from "next/link";

function RoomContents({ roomId }: { roomId: string }) {
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
          <ConnectionStatus />
          <CopyRoomLink />
          <ThemeSwitcher />
        </div>
      </header>

      {/* Main Composer Area */}
      <div className="relative z-10 mx-auto my-6 w-full max-w-5xl">
        {/* Center Hero Heading */}
        <div className="text-center mb-6">
          <h1 className="hero-heading flex items-center justify-center gap-2.5">
            <span className="brand-gradient">Write Me</span>
            <span className="text-[var(--text-primary)]">Live</span>
          </h1>
          <p className="theme-subtitle mx-auto mt-2 max-w-md text-xs sm:text-sm font-normal">
            Room: <span className="font-mono text-emerald-400">{roomId}</span> · Live real-time collaboration
          </p>
        </div>

        {/* Main Composer Card (Reference Style) */}
        <div className="glass-card rounded-2xl p-5 sm:p-8 space-y-6">
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
                <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Live Composer</h2>
                <p className="text-xs text-[var(--text-secondary)]">Collaborative canvas with instant peer synchronization</p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Room ID: {roomId}</span>
            </div>
          </div>

          {/* Participant Presence (Segmented Cards) */}
          <Presence />

          {/* Collaborative Editor */}
          <Editor />
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mx-auto text-center text-xs text-[var(--text-muted)] py-2">
        Write Me Live · Peer-to-peer collaborative writing workspace
      </footer>
    </main>
  );
}

function RoomSession({ roomId, name }: { roomId: string; name: string }) {
  const [errorState, setErrorState] = useState<{ code: string; message?: string } | null>(null);

  useErrorListener((error) => {
    const rawMessage = error.message;
    const message = rawMessage.toLowerCase();

    if (
      message.includes("room_not_found") ||
      message.includes("not found") ||
      message.includes("does not exist")
    ) {
      setErrorState({
        code: "ROOM_NOT_FOUND",
        message: "This room does not exist.",
      });
    } else if (
      message.includes("room_full") ||
      message.includes("full")
    ) {
      setErrorState({
        code: "ROOM_FULL",
        message: "This room is full. Write Me Live rooms support up to 2 people.",
      });
    } else if (
      message.includes("invalid_room_id") ||
      message.includes("invalid")
    ) {
      setErrorState({
        code: "INVALID_ROOM_ID",
        message: "This room link is not valid.",
      });
    } else if (
      message.includes("server_config_error") ||
      message.includes("configuration")
    ) {
      setErrorState({
        code: "SERVER_CONFIG_ERROR",
        message: "A server configuration error occurred.",
      });
    } else {
      setErrorState({
        code: "CONNECTION_ERROR",
        message: rawMessage || "The realtime connection to this room was interrupted.",
      });
    }
  });

  if (errorState) {
    return <RoomError code={errorState.code} roomId={roomId} message={errorState.message} />;
  }

  return (
    <RoomProvider id={roomId} initialPresence={{ name }}>
      <ClientSideSuspense
        fallback={
          <main className="luxury-shell flex min-h-screen items-center justify-center px-4">
            <ConstellationBackground />
            <div className="glass-card relative z-10 flex max-w-md items-center justify-center gap-3 rounded-2xl p-8 text-sm text-[var(--text-secondary)] shadow-2xl">
              <span className="loading-orbit" />
              <span className="font-medium">Connecting to live room…</span>
            </div>
          </main>
        }
      >
        <RoomContents roomId={roomId} />
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default function RoomClient({
  roomId,
  initialName,
}: {
  roomId: string;
  initialName: string | null;
}) {
  const [name, setName] = useState<string | null>(initialName);

  if (!name) {
    return (
      <NamePrompt
        onComplete={() => {
          // Fetch display name from cookie or set default
          fetch("/api/identity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Guest Writer" }) })
            .finally(() => setName("Guest Writer"));
        }}
      />
    );
  }

  return (
    <LiveblocksProvider>
      <RoomSession roomId={roomId} name={name} />
    </LiveblocksProvider>
  );
}
