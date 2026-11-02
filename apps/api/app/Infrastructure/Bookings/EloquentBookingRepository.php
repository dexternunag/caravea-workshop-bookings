<?php

namespace App\Infrastructure\Bookings;

use App\Models\Booking;
use Carbon\CarbonInterface;

final class EloquentBookingRepository
{
    /**
     * @param  array<string, mixed>  $attributes
     */
    public function create(array $attributes): Booking
    {
        return Booking::query()->create($attributes);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function update(Booking $booking, array $attributes): Booking
    {
        $booking->update($attributes);

        return $booking->refresh();
    }

    public function overlaps(
        string $serviceBay,
        CarbonInterface $startsAt,
        CarbonInterface $endsAt,
        ?int $exceptId = null,
    ): bool {
        return Booking::query()
            ->where('service_bay', $serviceBay)
            ->where('status', '!=', 'cancelled')
            ->where('starts_at', '<', $endsAt->utc()->toDateTimeString())
            ->where('ends_at', '>', $startsAt->utc()->toDateTimeString())
            ->when(
                $exceptId !== null,
                fn ($query) => $query->whereKeyNot($exceptId),
            )
            ->exists();
    }
}
