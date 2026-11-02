import { describe, expect, it } from "vitest";

import { resolveTheme } from "./theme";

describe("resolveTheme", () => {
  it("uses the explicitly selected theme", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("uses the system preference when requested", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});
