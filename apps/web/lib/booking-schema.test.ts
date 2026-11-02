import { describe, expect, it } from "vitest";

import { bookingFormSchema } from "./booking-schema";

const validBooking = {
  customer_name: "Avery Jones",
  customer_email: "avery@example.com",
  rego: "CAR-123",
  service_bay: "Bay 1",
  starts_at: "2026-11-03T09:00",
  ends_at: "2026-11-03T10:00",
  status: "pending",
  notes: "",
};

describe("bookingFormSchema", () => {
  it("rejects missing customer details and malformed emails", () => {
    const result = bookingFormSchema.safeParse({
      ...validBooking,
      customer_name: "",
      customer_email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  it("returns an ends at error when a booking ends at its start", () => {
    const result = bookingFormSchema.safeParse({
      ...validBooking,
      ends_at: validBooking.starts_at,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["ends_at"]);
    }
  });

  it("rejects an end time before the start time", () => {
    const result = bookingFormSchema.safeParse({
      ...validBooking,
      starts_at: "2026-11-03T10:00",
      ends_at: "2026-11-03T09:00",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["ends_at"]);
    }
  });

  it("accepts optional blank notes", () => {
    expect(bookingFormSchema.safeParse(validBooking).success).toBe(true);
  });
});
