import type { ThemeName } from "@/lib/theme";

const CURSOR_COLORS = {
  dark: ["rgb(95 191 170)", "rgb(224 134 89)"],
  "soft-dark": ["rgb(95 191 170)", "rgb(224 134 89)"],
} as const;

export function getUserColor(userId: string, theme: ThemeName, usedColors: ReadonlySet<string> = new Set()): string {
  const colors = CURSOR_COLORS[theme];
  let hash = 0;
  for (const character of userId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  const preferredIndex = hash % colors.length;

  for (let offset = 0; offset < colors.length; offset += 1) {
    const color = colors[(preferredIndex + offset) % colors.length];
    if (!usedColors.has(color)) return color;
  }

  return colors[preferredIndex];
}
