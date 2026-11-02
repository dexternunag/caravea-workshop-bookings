import type { BookingStatus } from "./bookings-api";

type QueryValue = string | string[] | undefined;

export type BookingQuery = {
  page: number;
  status: BookingStatus | undefined;
};

const statuses = new Set<BookingStatus>(["pending", "confirmed", "cancelled"]);

export function parseBookingQuery(query: Record<string, QueryValue>): BookingQuery {
  const rawStatus = firstValue(query.status);
  const rawPage = firstValue(query.page);
  const page = rawPage && /^\d+$/.test(rawPage) ? Number(rawPage) : 1;

  return {
    page: page > 0 ? page : 1,
    status: rawStatus && statuses.has(rawStatus as BookingStatus)
      ? (rawStatus as BookingStatus)
      : undefined,
  };
}

function firstValue(value: QueryValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
