import Link from "next/link";

import { BookingFilters } from "@/components/bookings/BookingFilters";
import { BookingsHeader } from "@/components/bookings/BookingsHeader";
import { BookingList } from "@/components/bookings/BookingList";
import { Button } from "@/components/ui/button";
import { fetchBookings } from "@/lib/bookings-api";
import { parseBookingQuery } from "@/lib/query";

type BookingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const query = parseBookingQuery(await searchParams);
  const bookings = await fetchBookings(query);

  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <BookingsHeader
        action={<Button asChild><Link href="/bookings/new">New booking</Link></Button>}
        description="Service bay schedule and customer work orders."
        title="Service bay schedule"
      />
      <section className="rounded-xl border border-border bg-card p-4 shadow-sm shadow-slate-950/5 dark:shadow-black/20">
        <BookingFilters key={query.status ?? "all"} status={query.status} />
      </section>
      <BookingList bookings={bookings} status={query.status} />
    </main>
  );
}
