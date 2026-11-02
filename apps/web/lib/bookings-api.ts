export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: number;
  customer_name: string;
  customer_email: string;
  rego: string;
  service_bay: string;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  notes: string | null;
};

export type BookingPage = {
  data: Booking[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

type BookingResource = { data: Booking };

export async function fetchBookings({
  page,
  status,
}: {
  page: number;
  status?: BookingStatus;
}): Promise<BookingPage> {
  const search = new URLSearchParams({ page: String(page) });

  if (status) {
    search.set("status", status);
  }

  const response = await fetch(apiUrl(`/api/bookings?${search.toString()}`), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load workshop bookings.");
  }

  return (await response.json()) as BookingPage;
}

export async function fetchBooking(id: string): Promise<Booking | null> {
  const response = await fetch(apiUrl(`/api/bookings/${id}`), {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load this workshop booking.");
  }

  return ((await response.json()) as BookingResource).data;
}

function apiUrl(path: string): string {
  return new URL(path, process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").toString();
}
