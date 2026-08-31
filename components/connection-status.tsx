"use client";

import { useStatus } from "@liveblocks/react/suspense";

export default function ConnectionStatus() {
  const status = useStatus();
  const label = status === "connected" ? "Connected" : status === "connecting" ? "Connecting…" : status === "reconnecting" ? "Reconnecting…" : "Connection lost";
  const color = status === "connected" ? "text-emerald-600" : status === "reconnecting" ? "text-amber-600" : status === "disconnected" ? "text-red-600" : "text-zinc-500";
  return <p className={`whitespace-nowrap text-xs font-medium ${color}`} aria-live="polite">● {label}</p>;
}
