import { describe, expect, it } from "vitest";

import { parseBookingQuery } from "./query";

describe("parseBookingQuery", () => {
  it("defaults an invalid booking query to page one without a status filter", () => {
    expect(parseBookingQuery({ status: "unknown", page: "-4" })).toEqual({
      page: 1,
      status: undefined,
    });
  });

  it("keeps a valid status filter and positive page number", () => {
    expect(parseBookingQuery({ status: "confirmed", page: "2" })).toEqual({
      page: 2,
      status: "confirmed",
    });
  });
});
