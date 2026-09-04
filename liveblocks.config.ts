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
    const theme = typeof document !== "undefined" ? document.documentElement.dataset.theme : undefined;
    try {
      const response = await fetch("/api/liveblocks-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-wml-theme": isThemeName(theme) ? theme : "dark" },
        body: JSON.stringify({ room }),
      });

      if (!response.ok) {
        let errData: { code?: string; message?: string } = {};
        try {
          errData = await response.json();
        } catch {
          // Fallback if not JSON
        }
        return {
          error: "forbidden",
          reason: `${errData.code ?? "AUTH_FAILED"}: ${errData.message ?? response.statusText}`,
        };
      }

      return response.json();
    } catch (err) {
      return {
        error: "forbidden",
        reason: err instanceof Error ? err.message : "Failed to connect to authentication service",
      };
    }
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
