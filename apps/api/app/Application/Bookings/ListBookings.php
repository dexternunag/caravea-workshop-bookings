<?php

namespace App\Application\Bookings;

use App\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

final class ListBookings
{
    /**
     * @return LengthAwarePaginator<int, Booking>
     */
    public function handle(?string $status): LengthAwarePaginator
    {
        return Booking::query()
            ->when($status !== null, fn ($query) => $query->where('status', $status))
            ->orderByDesc('starts_at')
            ->orderByDesc('id')
            ->paginate(perPage: 10)
            ->withQueryString();
    }
}
