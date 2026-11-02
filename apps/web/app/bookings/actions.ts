"use server";

import { revalidatePath } from "next/cache";

import type { BookingActionState } from "@/lib/booking-action-state";
import type { Booking } from "@/lib/bookings-api";
import { bookingFormSchema } from "@/lib/booking-schema";
import { toUtcIsoString } from "@/lib/booking-time";
import { mapLaravelValidationErrors } from "@/lib/laravel-errors";

export async function createBookingAction(
  _previousState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  return submitBooking("/api/bookings", "POST", formData);
}

export async function updateBookingAction(
  bookingId: number,
  _previousState: BookingActionState,
  formData: FormData,
): Promise<BookingActionState> {
  return submitBooking(`/api/bookings/${bookingId}`, "PATCH", formData);
}

async function submitBooking(
  path: string,
  method: "POST" | "PATCH",
  formData: FormData,
): Promise<BookingActionState> {
  const parsed = bookingFormSchema.safeParse(toBookingInput(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const response = await fetch(apiUrl(path), {
    method,
    body: JSON.stringify(parsed.data),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  if (response.status === 422) {
    return { fieldErrors: mapLaravelValidationErrors(await response.json()) };
  }

  if (!response.ok) {
    return { formError: "We could not save this booking. Please try again." };
  }

  const booking = ((await response.json()) as { data: Booking }).data;

  revalidatePath("/bookings");
  revalidatePath(`/bookings/${booking.id}`);

  return { success: true, bookingId: booking.id };
}

function toBookingInput(formData: FormData): Record<string, string> {
  return {
    customer_name: formValue(formData, "customer_name"),
    customer_email: formValue(formData, "customer_email"),
    rego: formValue(formData, "rego"),
    service_bay: formValue(formData, "service_bay"),
    starts_at: toUtcIsoString(formValue(formData, "starts_at")),
    ends_at: toUtcIsoString(formValue(formData, "ends_at")),
    status: formValue(formData, "status"),
    notes: formValue(formData, "notes"),
  };
}

function formValue(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function apiUrl(path: string): string {
  return new URL(path, process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").toString();
}
