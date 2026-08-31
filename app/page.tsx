"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createRoom() {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/rooms", { method: "POST" });
      const result = (await response.json()) as { roomId?: string; message?: string };
      if (!response.ok || !result.roomId) throw new Error(result.message ?? "Unable to create a room.");
      router.push(`/room/${result.roomId}`);
    } catch (creationError) {
      setError(creationError instanceof Error ? creationError.message : "Unable to create a room.");
      setIsCreating(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md text-center">
        <p className="mb-4 text-sm font-medium tracking-wide text-zinc-500">WRITE ME LIVE</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">Write together.</h1>
        <p className="mt-3 text-lg text-zinc-600">Write together. Instantly.</p>
        <button type="button" onClick={createRoom} disabled={isCreating} className="mt-9 min-h-12 rounded-lg bg-zinc-950 px-7 text-sm font-medium text-white transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-60">
          {isCreating ? "Creating room…" : "Create Room"}
        </button>
        <p className="mt-5 text-sm text-zinc-500">No account needed.</p>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </section>
    </main>
  );
}
