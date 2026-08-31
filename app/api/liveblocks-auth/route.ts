import { getOrCreateAnonymousId } from "@/lib/anonymous-user";
import { getLiveblocksServer } from "@/lib/liveblocks-server";
import { isValidRoomId } from "@/lib/room-id";

type AuthRequest = { room?: unknown };
function errorResponse(code: string, message: string, status: number) { return Response.json({ code, message }, { status }); }

export async function POST(request: Request) {
  let body: AuthRequest;
  try { body = (await request.json()) as AuthRequest; }
  catch { return errorResponse("INVALID_ROOM_ID", "This room link is not valid.", 400); }
  const roomId = typeof body.room === "string" ? body.room : "";
  if (!isValidRoomId(roomId)) return errorResponse("INVALID_ROOM_ID", "This room link is not valid.", 400);

  try {
    const liveblocks = getLiveblocksServer();
    await liveblocks.getRoom(roomId);
    const { id: anonymousId } = await getOrCreateAnonymousId();
    const activeUsers = await liveblocks.getActiveUsers(roomId);
    const activeIds = new Set(activeUsers.data.map((user) => user.id));
    // Best-effort occupancy check: inspection and authorization are not transactional.
    if (!activeIds.has(anonymousId) && activeIds.size >= 2) return errorResponse("ROOM_FULL", "This room is full. Write Me Live rooms support up to 2 people.", 409);
    const session = liveblocks.prepareSession(anonymousId);
    session.allow(roomId, session.FULL_ACCESS);
    const authorized = await session.authorize();
    return new Response(authorized.body, { status: authorized.status });
  } catch (error) {
    if ((error as { status?: number }).status === 404) return errorResponse("ROOM_NOT_FOUND", "This room does not exist.", 404);
    return errorResponse("SERVER_CONFIG_ERROR", "A server configuration error occurred.", 500);
  }
}
