"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-btn group relative overflow-hidden"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span
        className={`absolute inset-0 bg-gradient-to-br from-gold/15 to-primary/10 opacity-0 transition-opacity duration-300 ${
          isDark ? "opacity-100" : ""
        }`}
        aria-hidden="true"
      />
      {isDark ? (
        <Sun className="relative h-4 w-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
      ) : (
        <Moon className="relative h-4 w-4 transition-transform duration-300" aria-hidden="true" />
      )}
    </button>
  );
}
