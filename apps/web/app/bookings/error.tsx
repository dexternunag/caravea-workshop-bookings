"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Card><CardContent className="space-y-4 py-4">
        <div><h1 className="text-xl font-semibold text-foreground">We could not load bookings</h1><p className="mt-1 text-sm text-muted-foreground">Check that the Laravel API is running, then try again.</p></div>
        <Button onClick={() => reset()} type="button">Try again</Button>
      </CardContent></Card>
    </main>
  );
}
