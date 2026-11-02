import { describe, expect, it } from "vitest";

import { formatBookingDateTime, toBookingDateTimeInput, toUtcIsoString } from "./booking-time";

describe("booking time helpers", () => {
  it("treats datetime-local input as the workshop's UTC time", () => {
    expect(toUtcIsoString("2026-11-03T09:30")).toBe("2026-11-03T09:30:00.000Z");
  });

  it("formats and edits the same booking instant in UTC", () => {
    expect(toBookingDateTimeInput("2026-11-03T09:30:00.000000Z")).toBe("2026-11-03T09:30");
    expect(formatBookingDateTime("2026-11-03T09:30:00.000000Z")).toContain("9:30 am");
  });
});
