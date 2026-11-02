import type { Booking } from "./bookings-api";
import type { BookingFormInput, BookingFormValues } from "./booking-schema";
import { toBookingDateTimeInput } from "./booking-time";

export function bookingToFormValues(booking?: Booking): BookingFormInput {
  return {
    customer_name: booking?.customer_name ?? "",
    customer_email: booking?.customer_email ?? "",
    rego: booking?.rego ?? "",
    service_bay: booking?.service_bay ?? "",
    starts_at: toBookingDateTimeInput(booking?.starts_at) ?? "",
    ends_at: toBookingDateTimeInput(booking?.ends_at) ?? "",
    status: booking?.status ?? "pending",
    notes: booking?.notes ?? "",
  };
}

export function bookingFormData(values: BookingFormValues): FormData {
  const formData = new FormData();

  for (const [field, value] of Object.entries(values)) {
    formData.set(field, value ?? "");
  }

  return formData;
}
