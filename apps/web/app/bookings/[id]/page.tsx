import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchBooking } from "@/lib/bookings-api";
import { formatBookingDateTime } from "@/lib/booking-time";

type BookingDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const booking = await fetchBooking((await params).id);

  if (!booking) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <BookingsHeader
        action={<Button asChild variant="outline"><Link href={`/bookings/${booking.id}/edit`}>Edit booking</Link></Button>}
        description={`Booking in ${booking.service_bay}`}
        title={booking.customer_name}
      />
      <Button asChild className="-mt-3" size="sm" variant="outline"><Link href="/bookings">Back to bookings</Link></Button>
      <Card>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
            <div>
              <p className="text-sm font-medium text-primary">{booking.service_bay}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{booking.rego}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <dl className="grid gap-5 py-6 sm:grid-cols-2">
          <Detail label="Email" value={booking.customer_email} />
          <Detail label="Caravan registration" value={booking.rego} />
          <Detail label="Starts (UTC)" value={formatBookingDateTime(booking.starts_at)} />
          <Detail label="Ends (UTC)" value={formatBookingDateTime(booking.ends_at)} />
          <Detail label="Notes" value={booking.notes ?? "No notes"} />
        </dl>
        </CardContent>
      </Card>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: "pending" | "confirmed" | "cancelled" }) {
  const variant = status === "confirmed" ? "default" : status === "cancelled" ? "secondary" : "outline";

  return <Badge className="capitalize" variant={variant}>{status}</Badge>;
}

