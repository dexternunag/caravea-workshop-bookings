import { describe, expect, it } from "vitest";

import { useBookingFormUi } from "./booking-form-ui";

describe("useBookingFormUi", () => {
  it("tracks local submission state without storing bookings", () => {
    useBookingFormUi.getState().setSubmitting(true);

    expect(useBookingFormUi.getState().isSubmitting).toBe(true);
  });
});
