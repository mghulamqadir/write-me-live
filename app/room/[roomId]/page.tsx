import { isValidRoomId } from "@/lib/room-id";
import RoomClient from "./room-client";
import RoomError from "./room-error";

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params;
  if (!isValidRoomId(roomId)) return <RoomError code="INVALID_ROOM_ID" />;
  return <RoomClient roomId={roomId} />;
}
