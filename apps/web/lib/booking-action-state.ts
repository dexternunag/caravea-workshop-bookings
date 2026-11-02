import type { FieldErrors } from "@/lib/laravel-errors";

export type BookingActionState = {
  bookingId?: number;
  fieldErrors?: FieldErrors;
  formError?: string;
  success?: true;
};
