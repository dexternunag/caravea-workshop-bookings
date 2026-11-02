import { describe, expect, it } from "vitest";

import { mapLaravelValidationErrors } from "../../lib/laravel-errors";

describe("Laravel validation error translation", () => {
  it("keeps a Laravel overlap error on the service bay field", () => {
    expect(
      mapLaravelValidationErrors({
        errors: {
          service_bay: ["This service bay is already booked for that time."],
        },
      }),
    ).toEqual({
      service_bay: ["This service bay is already booked for that time."],
    });
  });
});
