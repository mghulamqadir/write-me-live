"use client";

import { useStatus } from "@/liveblocks.config";

export default function ConnectionStatus() {
  const status = useStatus();
  const isConnected = status === "connected";
  const isConnecting = status === "connecting" || status === "initial";
  const isReconnecting = status === "reconnecting";

  const label = isConnected
    ? "Active Session"
    : isConnecting
      ? "Connecting…"
      : isReconnecting
        ? "Reconnecting…"
        : "Disconnected";

  return (
    <div
      className="status-badge-active"
      aria-live="polite"
      title={`Live Connection: ${label}`}
    >
      <span
        className={`size-2 rounded-full ${
          isConnected
            ? "pulse-dot"
            : isConnecting || isReconnecting
              ? "animate-ping bg-amber-400"
              : "bg-red-500"
        }`}
      />
      <span className="font-medium tracking-wide">{label}</span>
    </div>
  );
}
