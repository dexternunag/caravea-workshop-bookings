<?php

namespace App\Domain\Bookings;

use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use InvalidArgumentException;

final class BookingWindow
{
    public function __construct(
        public readonly CarbonInterface $startsAt,
        public readonly CarbonInterface $endsAt,
    ) {
        if ($endsAt->lessThanOrEqualTo($startsAt)) {
            throw new InvalidArgumentException('A booking must end after it starts.');
        }
    }

    public static function fromStrings(string $startsAt, string $endsAt): self
    {
        return new self(
            CarbonImmutable::parse($startsAt)->utc(),
            CarbonImmutable::parse($endsAt)->utc(),
        );
    }
}
