import { Skeleton } from "@/components/ui/skeleton";

export default function BookingsLoading() {
  return (
    <main className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-3 border-b border-border pb-6"><Skeleton className="h-4 w-32" /><Skeleton className="h-9 w-72" /></div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-84 w-full" />
    </main>
  );
}
