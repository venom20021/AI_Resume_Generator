"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, startTransition } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    startTransition(() => setMounted(true));
  }, []);

  if (!mounted) {
    return (
      <button className="h-8 w-8 rounded-md border border-input bg-transparent flex items-center justify-center">
        <span className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-8 w-8 rounded-md border border-input bg-transparent flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 theme-toggle-icon" />
      ) : (
        <Moon className="h-4 w-4 theme-toggle-icon" />
      )}
    </button>
  );
}
