export const THEMES = ["dark", "soft-dark", "light", "sepia"] as const;
export type ThemeName = (typeof THEMES)[number];

export function isThemeName(value: string | null | undefined): value is ThemeName {
  return value !== null && value !== undefined && THEMES.includes(value as ThemeName);
}

export function getDefaultTheme(): ThemeName {
  return "dark";
}

export function isDarkTheme(theme: ThemeName): boolean {
  return theme === "dark" || theme === "soft-dark";
}
