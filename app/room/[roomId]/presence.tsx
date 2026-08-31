"use client";

import { useOthers, useSelf, useUpdateMyPresence } from "@/liveblocks.config";
import { FormEvent, useRef, useState } from "react";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/u);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function Presence() {
  const others = useOthers();
  const self = useSelf();
  const updateMyPresence = useUpdateMyPresence();

  const [isEditing, setIsEditing] = useState(false);
  const selfName = self?.presence?.name || self?.info?.name || "You";
  const selfColor = self?.info?.color || "var(--accent)";
  const [nameInput, setNameInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const count = others.length + (self ? 1 : 0);

  function handleOpenEdit() {
    setNameInput(selfName === "You" ? "" : selfName);
    setIsEditing(true);
  }

  async function handleSaveName(e: FormEvent) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;

    setIsSaving(true);
    // Broadcast live over WebSocket immediately to all peers
    updateMyPresence({ name: trimmed });

    // Persist to cookie in background
    try {
      await fetch("/api/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
    } catch {
      // Ignored
    }

    setIsSaving(false);
    setIsEditing(false);
  }

  return (
    <div className="w-full relative">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          ACTIVE PARTICIPANTS ({count} / 2)
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Current User Card */}
        {self ? (
          <button
            type="button"
            onClick={handleOpenEdit}
            title={`${selfName} (You) — click to edit your name`}
            className="segmented-card is-active group text-left w-full"
          >
            <div className="custom-radio">
              <span className="custom-radio-dot" />
            </div>
            <div
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: selfColor }}
            >
              {getInitials(selfName)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold truncate text-[var(--text-primary)]">
                  {selfName}
                </p>
                <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400 border border-emerald-800/40">
                  You
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 group-hover:text-emerald-400 transition-colors">
                Click to edit name ✎
              </p>
            </div>
          </button>
        ) : null}

        {/* Other Connected User(s) */}
        {others.map((user) => {
          const name = user.presence?.name || user.info?.name || "Guest Writer";
          const color = user.info?.color || "var(--accent)";
          return (
            <div
              key={`${user.id}-${user.connectionId}`}
              className="segmented-card is-active"
            >
              <div className="custom-radio">
                <span className="custom-radio-dot" />
              </div>
              <div
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white shadow-sm"
                style={{ backgroundColor: color }}
              >
                {getInitials(name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold truncate text-[var(--text-primary)]">
                    {name}
                  </p>
                  <span className="rounded bg-teal-950/80 px-1.5 py-0.5 text-[9px] font-semibold text-teal-400 border border-teal-800/40">
                    Peer
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  Synchronized & editing
                </p>
              </div>
            </div>
          );
        })}

        {/* Empty Slot Placeholder if 1 person */}
        {count < 2 ? (
          <div className="segmented-card opacity-60 border-dashed cursor-default hover:border-[var(--border)]">
            <div className="custom-radio opacity-40">
              <span className="custom-radio-dot" />
            </div>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[var(--border)] text-[11px] font-bold text-[var(--text-muted)]">
              +
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[var(--text-secondary)]">Waiting for co-writer…</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Share the room link to collaborate</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Inline Quick Rename Modal */}
      {isEditing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveName}
            className="glass-card relative w-full max-w-sm rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-2 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Update Your Name</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5">
                Display Name
              </label>
              <input
                ref={inputRef}
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                maxLength={40}
                placeholder="e.g. Lead Author, Ali, etc."
                className="theme-input h-10 w-full rounded-lg px-3 text-sm outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="theme-outline-button h-9 rounded-lg px-3.5 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !nameInput.trim()}
                className="theme-button flex h-9 items-center justify-center rounded-lg px-4 text-xs font-semibold disabled:opacity-50"
              >
                {isSaving ? "Updating…" : "Update Name"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
