import { getLiveblocksServer } from "@/lib/liveblocks-server";
import { generateRoomId } from "@/lib/room-id";

export async function POST() {
  try {
    const roomId = generateRoomId();
    await getLiveblocksServer().createRoom(roomId, { defaultAccesses: [] });
    return Response.json({ roomId });
  } catch {
    return Response.json({ code: "SERVER_CONFIG_ERROR", message: "The server is not configured to create rooms." }, { status: 500 });
  }
}
