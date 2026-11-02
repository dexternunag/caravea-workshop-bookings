import Link from "next/link";

import { BookingForm } from "@/components/bookings/BookingForm";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { Button } from "@/components/ui/button";

export default function NewBookingPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <BookingsHeader description="Assign a customer and caravan to a service bay." title="Create booking" />
      <Button asChild className="-mt-3" size="sm" variant="outline"><Link href="/bookings">Back to bookings</Link></Button>
      <BookingForm />
    </main>
  );
}
