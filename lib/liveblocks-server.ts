import { Liveblocks } from "@liveblocks/node";

const secret = process.env.LIVEBLOCKS_SECRET_KEY;

export function getLiveblocksServer() {
  if (!secret) throw new Error("Liveblocks server is not configured");
  return new Liveblocks({ secret });
}
