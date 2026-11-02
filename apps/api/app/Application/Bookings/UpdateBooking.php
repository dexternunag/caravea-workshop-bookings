<?php

namespace App\Application\Bookings;

use App\Domain\Bookings\BookingWindow;
use App\Domain\Bookings\OverlappingBooking;
use App\Infrastructure\Bookings\EloquentBookingRepository;
use App\Models\Booking;
use App\Models\ServiceBayLock;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

final class UpdateBooking
{
    public function __construct(private EloquentBookingRepository $bookings) {}

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(Booking $booking, array $attributes): Booking
    {
        $window = BookingWindow::fromStrings(
            $attributes['starts_at'],
            $attributes['ends_at'],
        );
        $attributes['starts_at'] = $window->startsAt->toDateTimeString();
        $attributes['ends_at'] = $window->endsAt->toDateTimeString();

        return DB::transaction(function () use ($attributes, $booking, $window): Booking {
            $this->lockServiceBays($booking->service_bay, $attributes['service_bay']);

            if ($attributes['status'] !== 'cancelled' && $this->bookings->overlaps(
                $attributes['service_bay'],
                $window->startsAt,
                $window->endsAt,
                $booking->id,
            )) {
                throw new OverlappingBooking('This service bay is already booked for that time.');
            }

            return $this->bookings->update($booking, $attributes);
        }, attempts: 5);
    }

    private function lockServiceBays(string $currentBay, string $requestedBay): void
    {
        $serviceBays = $this->sortedServiceBays($currentBay, $requestedBay);

        $serviceBays->each(fn (string $serviceBay) => ServiceBayLock::query()->firstOrCreate([
            'service_bay' => $serviceBay,
        ]));

        ServiceBayLock::query()
            ->whereIn('service_bay', $serviceBays)
            ->orderBy('service_bay')
            ->lockForUpdate()
            ->get();
    }

    /**
     * @return Collection<int, string>
     */
    private function sortedServiceBays(string $currentBay, string $requestedBay): Collection
    {
        return collect([$currentBay, $requestedBay])->unique()->sort()->values();
    }
}
