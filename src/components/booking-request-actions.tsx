"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { approveBooking, rejectBooking } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/button";

export function BookingRequestActions({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            try {
              await approveBooking(bookingId);
              toast.success("Booking approved");
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Could not approve booking"
              );
            }
          });
        }}
      >
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            try {
              await rejectBooking(bookingId);
              toast.success("Booking rejected");
            } catch (err) {
              toast.error(
                err instanceof Error ? err.message : "Could not reject booking"
              );
            }
          });
        }}
      >
        Reject
      </Button>
    </div>
  );
}
