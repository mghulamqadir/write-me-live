import { cookies } from "next/headers";

export const DISPLAY_NAME_COOKIE = "wml_display_name";
export const DISPLAY_NAME_MAX_LENGTH = 40;

export function normalizeDisplayName(name: string): string {
  return name.trim();
}

export function isValidDisplayName(name: string): boolean {
  const normalized = normalizeDisplayName(name);
  return normalized.length > 0 && normalized.length <= DISPLAY_NAME_MAX_LENGTH && !/[\u0000-\u001F\u007F]/u.test(normalized);
}

export async function getDisplayName(): Promise<string | null> {
  const value = (await cookies()).get(DISPLAY_NAME_COOKIE)?.value;
  return value && isValidDisplayName(value) ? value : null;
}
