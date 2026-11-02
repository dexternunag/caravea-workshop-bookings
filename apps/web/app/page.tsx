import { redirect } from "next/navigation";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value) ? value : value ? [value] : []) {
      query.append(key, item);
    }
  }

  redirect(`/bookings${query.size > 0 ? `?${query.toString()}` : ""}`);
}
