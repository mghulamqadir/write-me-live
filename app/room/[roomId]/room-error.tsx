"use client";

import Link from "next/link";

const messages: Record<string, string> = {
  INVALID_ROOM_ID: "That room link is not valid.",
  ROOM_NOT_FOUND: "This room does not exist.",
  ROOM_FULL: "This room is full. Write Me Live rooms support up to 2 people.",
  SERVER_CONFIG_ERROR: "We couldn’t connect because of a server configuration error.",
  CONNECTION_ERROR: "The connection to this room was lost.",
};

export default function RoomError({ code = "CONNECTION_ERROR" }: { code?: string }) {
  return <main className="flex min-h-screen items-center justify-center px-6"><section className="max-w-md text-center"><p className="text-sm font-medium tracking-wide text-zinc-500">WRITE ME LIVE</p><h1 className="mt-4 text-2xl font-semibold text-zinc-950">{messages[code] ?? messages.CONNECTION_ERROR}</h1><Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2">Create a new room</Link></section></main>;
}
