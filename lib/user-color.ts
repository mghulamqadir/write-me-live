import { isDarkTheme, type ThemeName } from "@/lib/theme";

const CURSOR_COLORS = {
  light: ["rgb(5 150 105)", "rgb(2 132 199)"],
  dark: ["rgb(16 185 129)", "rgb(56 189 248)"],
} as const;

export function getUserColor(userId: string, theme: ThemeName, usedColors: ReadonlySet<string> = new Set()): string {
  const colors = CURSOR_COLORS[isDarkTheme(theme) ? "dark" : "light"];
  let hash = 0;
  for (const character of userId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  const preferredIndex = hash % colors.length;

  for (let offset = 0; offset < colors.length; offset += 1) {
    const color = colors[(preferredIndex + offset) % colors.length];
    if (!usedColors.has(color)) return color;
  }

  return colors[preferredIndex];
}
