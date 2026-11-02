import Link from "next/link";

import { BookingTableRow } from "@/components/bookings/BookingTableRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { BookingPage, BookingStatus } from "@/lib/bookings-api";

export function BookingList({ bookings, status }: { bookings: BookingPage; status?: BookingStatus }) {
  const query = status ? `&status=${status}` : "";

  return (
    <Card className="gap-0 py-0">
      <CardContent className="overflow-x-auto px-0">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/60 text-xs font-medium tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3.5">Customer</th>
              <th className="px-5 py-3.5">Rego</th>
              <th className="px-5 py-3.5">Bay</th>
              <th className="px-5 py-3.5">Service window (UTC)</th>
              <th className="px-5 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.data.map((booking) => <BookingTableRow booking={booking} key={booking.id} />)}
          </tbody>
        </table>
        {bookings.data.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-medium text-foreground">No bookings found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try another status or create a new workshop booking.</p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <span className="text-sm text-muted-foreground">Page {bookings.meta.current_page} of {bookings.meta.last_page}</span>
        <div className="flex gap-2">
          {bookings.meta.current_page > 1 ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/bookings?page=${bookings.meta.current_page - 1}${query}`}>Previous</Link>
            </Button>
          ) : null}
          {bookings.meta.current_page < bookings.meta.last_page ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/bookings?page=${bookings.meta.current_page + 1}${query}`}>Next</Link>
            </Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
