"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { cancelBooking } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/button";

export function CancelBookingButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          try {
            await cancelBooking(bookingId);
            toast.success("Booking cancelled");
          } catch {
            toast.error("Could not cancel booking");
          }
        });
      }}
    >
      {isPending ? "Cancelling..." : "Cancel"}
    </Button>
  );
}
