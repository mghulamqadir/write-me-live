import { nanoid } from "nanoid";
import { cookies } from "next/headers";

export const ANONYMOUS_ID_COOKIE = "wml_anon_id";

export async function getOrCreateAnonymousId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(ANONYMOUS_ID_COOKIE)?.value;
  if (existing) return { id: existing, isNew: false };
  const id = nanoid();
  cookieStore.set({ name: ANONYMOUS_ID_COOKIE, value: id, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
  return { id, isNew: true };
}
