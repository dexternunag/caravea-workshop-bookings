"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { resolveTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <Button aria-label="Toggle theme" size="sm" variant="outline">Theme</Button>;
  }

  const activeTheme = resolveTheme(
    theme === "dark" || theme === "light" || theme === "system" ? theme : "system",
    resolvedTheme === "dark",
  );
  const nextTheme = activeTheme === "dark" ? "light" : "dark";

  return (
    <Button
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => setTheme(nextTheme)}
      size="sm"
      variant="outline"
    >
      {activeTheme === "dark" ? "Light mode" : "Dark mode"}
    </Button>
  );
}
