import { isValidRoomId } from "@/lib/room-id";
import { getDisplayName } from "@/lib/display-name";
import { getLiveblocksServer } from "@/lib/liveblocks-server";
import RoomClient from "./room-client";
import RoomError from "./room-error";

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return <RoomError code="INVALID_ROOM_ID" roomId={roomId} />;

  try {
    const liveblocks = getLiveblocksServer();
    await liveblocks.getRoom(roomId);
  } catch (error) {
    if ((error as { status?: number }).status === 404) {
      return <RoomError code="ROOM_NOT_FOUND" roomId={roomId} />;
    }
  }

  const displayName = await getDisplayName();
  return <RoomClient roomId={roomId} initialName={displayName} />;
}
