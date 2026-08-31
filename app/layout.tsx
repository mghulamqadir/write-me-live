import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Write Me Live — Collaborative Workspace",
  description: "Real-time, two-person collaborative writing room with instant sync.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeScript = `(function(){try{var valid={dark:1,"soft-dark":1};var stored=localStorage.getItem("wml_theme");var cookie=document.cookie.match(/(?:^|; )wml_theme=([^;]+)/);var theme=valid[stored]?stored:(cookie&&valid[cookie[1]]?cookie[1]:"dark");document.documentElement.dataset.theme=theme}catch(e){document.documentElement.dataset.theme="dark"}})()`;
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="theme-body">{children}</body>
    </html>
  );
}
