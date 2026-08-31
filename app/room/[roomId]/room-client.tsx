"use client";

import { ClientSideSuspense, LiveblocksProvider, RoomProvider, useErrorListener } from "@liveblocks/react/suspense";
import { useState } from "react";
import ConnectionStatus from "@/components/connection-status";
import CopyRoomLink from "@/components/copy-room-link";
import Editor from "./editor";
import Presence from "./presence";
import RoomError from "./room-error";

function RoomContents() {
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useErrorListener((error) => {
    const message = error.message.toLowerCase();
    if (message.includes("full")) setErrorCode("ROOM_FULL");
    else if (message.includes("not found") || message.includes("does not exist")) setErrorCode("ROOM_NOT_FOUND");
    else if (message.includes("configuration")) setErrorCode("SERVER_CONFIG_ERROR");
  });

  if (errorCode) return <RoomError code={errorCode} />;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-8 sm:py-10">
      <header className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-wide text-zinc-500">WRITE ME LIVE</p>
          <Presence />
        </div>
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          <CopyRoomLink />
        </div>
      </header>
      <div className="mx-auto mt-6 w-full max-w-[900px]">
        <Editor />
      </div>
    </main>
  );
}

export default function RoomClient({ roomId }: { roomId: string }) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{}}>
        <ClientSideSuspense fallback={<p className="p-8 text-center text-sm text-zinc-500">Joining room…</p>}>
          <RoomContents />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
