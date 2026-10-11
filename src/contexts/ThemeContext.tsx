import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Theme = "v3" | "v5" | "v7" | "v10";

export interface ThemeOption {
  id: Theme;
  name: string;
  description: string;
  dark: boolean;
}

export const THEMES: ThemeOption[] = [
  { id: "v3", name: "Vidrio", description: "Claro · Glassmorphism", dark: false },
  { id: "v5", name: "Menta", description: "Claro · Minimal suave", dark: false },
  { id: "v7", name: "Aurora", description: "Oscuro · Vidrio animado", dark: true },
  { id: "v10", name: "Profundo", description: "Oscuro · Azul marino", dark: true },
];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const STORAGE_KEY = "fp-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "v5";
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "v3" || stored === "v5" || stored === "v7" || stored === "v10") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "v7"
    : "v5";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("v3", "v5", "v7", "v10");
    root.classList.add(theme);
    root.classList.toggle("dark", theme === "v7" || theme === "v10");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isDark: theme === "v7" || theme === "v10" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de <ThemeProvider>");
  return ctx;
}
