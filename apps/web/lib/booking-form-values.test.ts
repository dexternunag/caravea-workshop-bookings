import { describe, expect, it } from "vitest";

import { bookingToFormValues } from "./booking-form-values";

describe("bookingToFormValues", () => {
  it("uses UTC datetime-local values when editing an existing booking", () => {
    expect(
      bookingToFormValues({
        id: 1,
        customer_name: "Avery Jones",
        customer_email: "avery@example.com",
        rego: "CAR-123",
        service_bay: "Bay 1",
        starts_at: "2026-11-03T09:00:00.000000Z",
        ends_at: "2026-11-03T10:00:00.000000Z",
        status: "confirmed",
        notes: null,
      }),
    ).toMatchObject({
      starts_at: "2026-11-03T09:00",
      ends_at: "2026-11-03T10:00",
      notes: "",
      status: "confirmed",
    });
  });
});
