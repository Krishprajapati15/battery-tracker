"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeHeader() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="fixed z-50 right-0 top-0 w-full flex justify-end px-8 py-6">
      <button
        className="rounded-full border-none bg-transparent p-2 focus:outline-none"
        aria-label="Toggle theme"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <Sun className="w-7 h-7 text-white" />
        ) : (
          <Moon className="w-7 h-7 text-black" />
        )}
      </button>
    </header>
  );
}
