import { nanoid } from "nanoid";

const ROOM_ID_PATTERN = /^[A-Za-z0-9_-]{10,64}$/;

export function generateRoomId(): string { return nanoid(16); }
export function isValidRoomId(id: string): boolean { return ROOM_ID_PATTERN.test(id); }
