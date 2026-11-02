<?php

namespace App\Application\Bookings;

use App\Domain\Bookings\BookingWindow;
use App\Domain\Bookings\OverlappingBooking;
use App\Infrastructure\Bookings\EloquentBookingRepository;
use App\Models\Booking;
use App\Models\ServiceBayLock;
use Illuminate\Support\Facades\DB;

final class CreateBooking
{
    public function __construct(private EloquentBookingRepository $bookings) {}

    /**
     * @param  array<string, mixed>  $attributes
     */
    public function handle(array $attributes): Booking
    {
        $window = BookingWindow::fromStrings(
            $attributes['starts_at'],
            $attributes['ends_at'],
        );
        $attributes['starts_at'] = $window->startsAt->toDateTimeString();
        $attributes['ends_at'] = $window->endsAt->toDateTimeString();

        return DB::transaction(function () use ($attributes, $window): Booking {
            $serviceBay = $attributes['service_bay'];

            $lock = ServiceBayLock::query()->firstOrCreate([
                'service_bay' => $serviceBay,
            ]);

            ServiceBayLock::query()
                ->whereKey($lock->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($attributes['status'] !== 'cancelled' && $this->bookings->overlaps(
                $serviceBay,
                $window->startsAt,
                $window->endsAt,
            )) {
                throw new OverlappingBooking('This service bay is already booked for that time.');
            }

            return $this->bookings->create($attributes);
        }, attempts: 5);
    }
}
