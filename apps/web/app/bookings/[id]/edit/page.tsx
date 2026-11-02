import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingForm } from "@/components/bookings/BookingForm";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { Button } from "@/components/ui/button";
import { fetchBooking } from "@/lib/bookings-api";

type EditBookingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBookingPage({ params }: EditBookingPageProps) {
  const booking = await fetchBooking((await params).id);

  if (!booking) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <BookingsHeader description={`Update the service booking for ${booking.customer_name}.`} title="Edit booking" />
      <Button asChild className="-mt-3" size="sm" variant="outline"><Link href={`/bookings/${booking.id}`}>Back to booking</Link></Button>
      <BookingForm booking={booking} />
    </main>
  );
}
