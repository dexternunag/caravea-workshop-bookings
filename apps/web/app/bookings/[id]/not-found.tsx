import Link from "next/link";

export default function BookingNotFound() {
  return (
    <main className="mx-auto max-w-3xl space-y-4 px-6 py-12">
      <h1 className="text-2xl font-bold text-slate-950">Booking not found</h1>
      <p className="text-slate-600">This booking may have been removed or the link is incorrect.</p>
      <Link className="font-semibold text-sky-700 underline" href="/bookings">
        Return to bookings
      </Link>
    </main>
  );
}
