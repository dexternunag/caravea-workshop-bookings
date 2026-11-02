"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";

import { Badge } from "@/components/ui/badge";
import type { Booking, BookingStatus } from "@/lib/bookings-api";
import { formatBookingDateTime } from "@/lib/booking-time";

export function BookingTableRow({ booking }: { booking: Booking }) {
  const router = useRouter();

  function openBooking() {
    router.push(`/bookings/${booking.id}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openBooking();
    }
  }

  return (
    <tr
      aria-label={`Open booking for ${booking.customer_name}`}
      className="cursor-pointer transition-colors hover:bg-muted/45 focus-visible:bg-muted/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      key={booking.id}
      onClick={openBooking}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
    >
      <td className="px-5 py-4">
        <span className="font-medium text-foreground underline-offset-4">{booking.customer_name}</span>
        <p className="mt-0.5 text-xs text-muted-foreground">{booking.customer_email}</p>
      </td>
      <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{booking.rego}</td>
      <td className="px-5 py-4">{booking.service_bay}</td>
      <td className="px-5 py-4 text-muted-foreground">
        <time dateTime={booking.starts_at}>{formatBookingDateTime(booking.starts_at)}</time>
        <span className="px-1.5 text-muted-foreground/70">to</span>
        <time dateTime={booking.ends_at}>{formatBookingDateTime(booking.ends_at)}</time>
      </td>
      <td className="px-5 py-4"><StatusBadge status={booking.status} /></td>
    </tr>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const variant = status === "confirmed" ? "default" : status === "cancelled" ? "secondary" : "outline";

  return <Badge className="capitalize" variant={variant}>{status}</Badge>;
}
