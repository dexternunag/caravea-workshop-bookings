export const BOOKING_TIME_ZONE = "UTC";

export function formatBookingDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: BOOKING_TIME_ZONE,
  }).format(new Date(value));
}

export function toBookingDateTimeInput(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const instant = new Date(value);

  if (Number.isNaN(instant.getTime())) {
    return undefined;
  }

  return [
    instant.getUTCFullYear(),
    String(instant.getUTCMonth() + 1).padStart(2, "0"),
    String(instant.getUTCDate()).padStart(2, "0"),
  ].join("-") + `T${String(instant.getUTCHours()).padStart(2, "0")}:${String(instant.getUTCMinutes()).padStart(2, "0")}`;
}

export function toUtcIsoString(value: string): string {
  if (!value || value.endsWith("Z") || /[+-]\d\d:\d\d$/.test(value)) {
    return value;
  }

  const instant = new Date(`${value}Z`);

  return Number.isNaN(instant.getTime()) ? value : instant.toISOString();
}
