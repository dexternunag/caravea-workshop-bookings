"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BookingStatus } from "@/lib/bookings-api";

const allStatuses = "all";

export function BookingFilters({ status }: { status?: BookingStatus }) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(status ?? allStatuses);

  function applyFilter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new URLSearchParams();

    if (selectedStatus !== allStatuses) {
      query.set("status", selectedStatus);
    }

    router.push(`/bookings${query.size > 0 ? `?${query.toString()}` : ""}`);
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={applyFilter}>
      <div className="grid gap-2">
        <Label htmlFor="booking-status">Status</Label>
        <Select onValueChange={setSelectedStatus} value={selectedStatus}>
          <SelectTrigger aria-label="Booking status" id="booking-status" className="w-full sm:w-52">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={allStatuses}>All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Apply filter</Button>
    </form>
  );
}
