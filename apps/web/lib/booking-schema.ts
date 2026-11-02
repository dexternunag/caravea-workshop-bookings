import { z } from "zod";

export const bookingFormSchema = z
  .object({
    customer_name: z.string().trim().min(1, "Customer name is required.").max(255),
    customer_email: z.email("Enter a valid customer email.").max(255),
    rego: z.string().trim().min(1, "Registration is required.").max(50),
    service_bay: z.string().trim().min(1, "Service bay is required.").max(100),
    starts_at: z.string().min(1, "Start time is required."),
    ends_at: z.string().min(1, "End time is required."),
    status: z.enum(["pending", "confirmed", "cancelled"]),
    notes: z.string().max(65535).transform((value) => value.trim() || null),
  })
  .refine(
    (booking) => bookingInstant(booking.ends_at) > bookingInstant(booking.starts_at),
    {
      error: "End time must be after the start time.",
      path: ["ends_at"],
    },
  );

function bookingInstant(value: string): number {
  const normalized = value.endsWith("Z") || /[+-]\d\d:\d\d$/.test(value) ? value : `${value}Z`;

  return new Date(normalized).getTime();
}

export type BookingFormValues = z.output<typeof bookingFormSchema>;
export type BookingFormInput = z.input<typeof bookingFormSchema>;
