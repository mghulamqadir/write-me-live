"use client";

import { useEffect, useRef, useState } from "react";
import { getDefaultTheme, isThemeName, THEMES, type ThemeName } from "@/lib/theme";

const labels: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
  "soft-dark": "Soft dark",
  sepia: "Sepia",
};

function ThemeIcon({ theme }: { theme: ThemeName }) {
  switch (theme) {
    case "light":
      return (
        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case "dark":
      return (
        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      );
    case "soft-dark":
      return (
        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor" />
        </svg>
      );
    case "sepia":
      return (
        <svg className="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
        </svg>
      );
  }
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeName>(getDefaultTheme());
  const [open, setOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("wml_theme");
    const current = document.documentElement.dataset.theme;
    const nextTheme = isThemeName(stored) ? stored : isThemeName(current) ? current : getDefaultTheme();
    const frame = window.requestAnimationFrame(() => setTheme(nextTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    function closeOnOutside(event: PointerEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, []);

  function changeTheme(nextTheme: ThemeName) {
    document.documentElement.classList.add("theme-transition");
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("wml_theme", nextTheme);
    document.cookie = `wml_theme=${nextTheme}; Max-Age=31536000; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    setTheme(nextTheme);
    setOpen(false);

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 850);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((value) => !value);
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const index = THEMES.indexOf(theme);
    const nextIndex = event.key === "ArrowDown" ? (index + 1) % THEMES.length : (index - 1 + THEMES.length) % THEMES.length;
    changeTheme(THEMES[nextIndex]);
  }

  return (
    <div ref={switcherRef} className="theme-switcher-container">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Theme: ${labels[theme]}`}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={handleKeyDown}
        className="theme-switcher"
      >
        <span className="theme-switcher-mark">
          <ThemeIcon theme={theme} />
        </span>
        <span className="theme-switcher-label">{labels[theme]}</span>
        <span className="theme-switcher-chevron">
          <svg className={`size-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m6 8 4 4 4-4" />
          </svg>
        </span>
      </button>
      {open ? (
        <div role="listbox" aria-label="Choose theme" className="theme-menu">
          {THEMES.map((option) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={theme === option}
              onClick={() => changeTheme(option)}
              className={`theme-menu-option ${theme === option ? "is-selected" : ""}`}
            >
              <span className="theme-menu-symbol">
                <ThemeIcon theme={option} />
              </span>
              <span>{labels[option]}</span>
              {theme === option ? (
                <span className="theme-menu-check">
                  <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 13 4 4L19 7" />
                  </svg>
                </span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
