import { cookies } from "next/headers";
import { DISPLAY_NAME_COOKIE, DISPLAY_NAME_MAX_LENGTH, isValidDisplayName, normalizeDisplayName } from "@/lib/display-name";

export async function POST(request: Request) {
  let body: { name?: unknown };
  try {
    body = (await request.json()) as { name?: unknown };
  } catch {
    return Response.json({ code: "INVALID_NAME", message: "Please enter a valid name." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? normalizeDisplayName(body.name) : "";
  if (!isValidDisplayName(name)) {
    return Response.json({ code: "INVALID_NAME", message: `Please enter a name between 1 and ${DISPLAY_NAME_MAX_LENGTH} characters.` }, { status: 400 });
  }

  (await cookies()).set({
    name: DISPLAY_NAME_COOKIE,
    value: name,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return Response.json({ ok: true });
}
