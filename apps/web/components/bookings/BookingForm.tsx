"use client";

import { startTransition, useActionState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type FieldPath } from "react-hook-form";
import { useRouter } from "next/navigation";

import { createBookingAction, updateBookingAction } from "@/app/bookings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BookingActionState } from "@/lib/booking-action-state";
import type { Booking } from "@/lib/bookings-api";
import { bookingFormData, bookingToFormValues } from "@/lib/booking-form-values";
import { bookingFormSchema, type BookingFormInput, type BookingFormValues } from "@/lib/booking-schema";
import { BOOKING_TIME_ZONE } from "@/lib/booking-time";
import { useBookingFormUi } from "@/stores/booking-form-ui";

type BookingFormProps = {
  booking?: Booking;
};

const initialBookingActionState: BookingActionState = {};
const bookingFields = [
  "customer_name",
  "customer_email",
  "rego",
  "service_bay",
  "starts_at",
  "ends_at",
  "status",
  "notes",
] as const satisfies readonly FieldPath<BookingFormInput>[];

export function BookingForm({ booking }: BookingFormProps) {
  const router = useRouter();
  const action = booking ? updateBookingAction.bind(null, booking.id) : createBookingAction;
  const [state, formAction, isPending] = useActionState(action, initialBookingActionState);
  const resetUi = useBookingFormUi((store) => store.reset);
  const setSubmitting = useBookingFormUi((store) => store.setSubmitting);
  const {
    clearErrors,
    control,
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset: resetForm,
    setError,
  } = useForm<BookingFormInput, unknown, BookingFormValues>({
    defaultValues: bookingToFormValues(booking),
    mode: "onBlur",
    reValidateMode: "onChange",
    resolver: zodResolver(bookingFormSchema),
  });

  useEffect(() => {
    setSubmitting(isPending);
  }, [isPending, setSubmitting]);

  useEffect(() => {
    for (const [field, messages] of Object.entries(state.fieldErrors ?? {})) {
      if (isBookingField(field) && messages[0]) {
        setError(field, { message: messages[0], type: "server" });
      }
    }
  }, [setError, state.fieldErrors]);

  useEffect(() => {
    if (state.success && state.bookingId) {
      resetForm(bookingToFormValues(booking));
      resetUi();
      router.push(`/bookings/${state.bookingId}`);
    }
  }, [booking, resetForm, resetUi, router, state.bookingId, state.success]);

  function submit(values: BookingFormValues) {
    clearErrors();
    startTransition(() => {
      formAction(bookingFormData(values));
    });
  }

  const isSubmitting = isPending;

  return (
    <Card>
      <CardContent className="pt-4">
        <form className="space-y-7" noValidate onSubmit={handleSubmit(submit)}>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField error={errors.customer_name?.message} label="Customer name" registration={register("customer_name")} />
            <TextField error={errors.customer_email?.message} label="Customer email" registration={register("customer_email")} type="email" />
            <TextField error={errors.rego?.message} label="Caravan registration" registration={register("rego")} />
            <TextField error={errors.service_bay?.message} label="Service bay" registration={register("service_bay")} />
            <TextField error={errors.starts_at?.message} label={`Starts at (${BOOKING_TIME_ZONE})`} registration={register("starts_at")} type="datetime-local" />
            <TextField error={errors.ends_at?.message} label={`Ends at (${BOOKING_TIME_ZONE})`} registration={register("ends_at")} type="datetime-local" />
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-describedby={errors.status ? "status-error" : undefined} aria-invalid={Boolean(errors.status)} id="status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError id="status-error" message={errors.status?.message} />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="notes">Notes <span className="font-normal text-muted-foreground">Optional</span></Label>
              <Textarea aria-describedby={errors.notes ? "notes-error" : undefined} aria-invalid={Boolean(errors.notes)} className="min-h-28" id="notes" {...register("notes")} />
              <FieldError id="notes-error" message={errors.notes?.message} />
            </div>
          </div>
          {state.formError ? <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{state.formError}</p> : null}
          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <Button disabled={isSubmitting} type="submit">{isSubmitting ? "Saving" : booking ? "Save changes" : "Create booking"}</Button>
            {isDirty ? <span className="text-sm text-muted-foreground">Unsaved changes</span> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function TextField({
  error,
  label,
  registration,
  type = "text",
}: {
  error?: string;
  label: string;
  registration: ReturnType<ReturnType<typeof useForm<BookingFormInput>>["register"]>;
  type?: "datetime-local" | "email" | "text";
}) {
  const id = registration.name;

  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input aria-describedby={errorId} aria-invalid={Boolean(error)} id={id} type={type} {...registration} />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id?: string; message?: string }) {
  return message ? <p className="text-sm text-destructive" id={id} role="alert">{message}</p> : null;
}

function isBookingField(field: string): field is FieldPath<BookingFormInput> {
  return bookingFields.includes(field as FieldPath<BookingFormInput>);
}
