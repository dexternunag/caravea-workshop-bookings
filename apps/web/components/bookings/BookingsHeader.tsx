import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";

export function BookingsHeader({
  action,
  description,
  title,
}: {
  action?: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-primary">Workshop bookings</p>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-start sm:self-auto">
        <ThemeToggle />
        {action}
      </div>
    </header>
  );
}
