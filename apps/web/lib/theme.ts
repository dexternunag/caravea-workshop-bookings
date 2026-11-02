export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = Exclude<ThemePreference, "system">;

export function resolveTheme(
  preference: ThemePreference,
  systemPrefersDark: boolean,
): ResolvedTheme {
  if (preference === "system") {
    return systemPrefersDark ? "dark" : "light";
  }

  return preference;
}
