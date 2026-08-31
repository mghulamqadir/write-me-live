import { createClient } from "@liveblocks/client";
import { createLiveblocksContext, createRoomContext } from "@liveblocks/react";
import { isThemeName } from "@/lib/theme";

declare global {
  interface Liveblocks {
    Presence: {
      name?: string;
    };
    UserMeta: {
      id: string;
      info: { name?: string; color?: string };
    };
  }
}

export const liveblocksClient = createClient({
  authEndpoint: async (room) => {
    const theme = document.documentElement.dataset.theme;
    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-wml-theme": isThemeName(theme) ? theme : "light" },
      body: JSON.stringify({ room }),
    });
    return response.json();
  },
});

const liveblocksContext = createLiveblocksContext(liveblocksClient);
const roomContext = createRoomContext(liveblocksClient);
export const { LiveblocksProvider } = liveblocksContext;
export const {
  RoomProvider,
  useErrorListener,
  useStatus,
  useOthers,
  useSelf,
  useUpdateMyPresence,
  useMyPresence,
} = roomContext.suspense;
