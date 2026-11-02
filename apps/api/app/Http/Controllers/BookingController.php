<?php

namespace App\Http\Controllers;

use App\Application\Bookings\CreateBooking;
use App\Application\Bookings\ListBookings;
use App\Application\Bookings\UpdateBooking;
use App\Domain\Bookings\OverlappingBooking;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\ValidationException;

final class BookingController extends Controller
{
    public function index(Request $request, ListBookings $listBookings): AnonymousResourceCollection
    {
        $status = $request->query('status');
        $allowedStatuses = ['pending', 'confirmed', 'cancelled'];

        return BookingResource::collection($listBookings->handle(
            is_string($status) && in_array($status, $allowedStatuses, true) ? $status : null,
        ));
    }

    public function store(StoreBookingRequest $request, CreateBooking $createBooking): JsonResponse
    {
        try {
            $booking = $createBooking->handle($request->validated());
        } catch (OverlappingBooking $exception) {
            throw ValidationException::withMessages([
                'service_bay' => [$exception->getMessage()],
            ]);
        }

        return (new BookingResource($booking))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Booking $booking): BookingResource
    {
        return new BookingResource($booking);
    }

    public function update(
        UpdateBookingRequest $request,
        Booking $booking,
        UpdateBooking $updateBooking,
    ): BookingResource {
        try {
            return new BookingResource($updateBooking->handle($booking, $request->validated()));
        } catch (OverlappingBooking $exception) {
            throw ValidationException::withMessages([
                'service_bay' => [$exception->getMessage()],
            ]);
        }
    }

    public function destroy(Booking $booking): JsonResponse
    {
        $booking->delete();

        return response()->json(status: 204);
    }
}
