"use client";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState, createContext } from "react";
import { ImageKitProvider } from "@imagekit/next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

export type ThemeMode = "light" | "dark" | "system";

export const ThemeContext = createContext<{
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}>({ theme: "system", setTheme: () => {} });

export default function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    // initialize theme from localStorage or system preference
    try {
      const saved = window.localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved as ThemeMode);
        document.documentElement.setAttribute("data-theme", saved);
      } else {
        const prefersDark =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initial = prefersDark ? "dark" : "light";
        setTheme("system");
        document.documentElement.setAttribute("data-theme", initial);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    // when theme state changes, persist and apply
    if (theme === "system") return;
    try {
      window.localStorage.setItem("theme", theme);
      document.documentElement.setAttribute(
        "data-theme",
        theme === "dark" ? "dark" : "light"
      );
    } catch {}
  }, [theme]);

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ImageKitProvider urlEndpoint={urlEndpoint}>
          {children}
        </ImageKitProvider>
      </ThemeContext.Provider>
    </SessionProvider>
  );
}
