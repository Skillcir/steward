"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import { createBooking } from "@/lib/actions/bookings";
import type { ActionState } from "@/lib/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export function BookingForm({ resourceId }: { resourceId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createBooking,
    initialState
  );

  useEffect(() => {
    if (state.ok) {
      toast.success("Booking requested — awaiting approval");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="resourceId" value={resourceId} />

      {state.error && <p className="text-body-sm text-ink-soft">{state.error}</p>}

      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="Team standup" required />
        {state.fieldErrors?.title && (
          <p className="text-body-sm text-ink-soft">{state.fieldErrors.title[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="startTime">Start</Label>
        <Input id="startTime" name="startTime" type="datetime-local" required />
        {state.fieldErrors?.startTime && (
          <p className="text-body-sm text-ink-soft">
            {state.fieldErrors.startTime[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="endTime">End</Label>
        <Input id="endTime" name="endTime" type="datetime-local" required />
        {state.fieldErrors?.endTime && (
          <p className="text-body-sm text-ink-soft">{state.fieldErrors.endTime[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="batch">Batch (optional)</Label>
        <Input id="batch" name="batch" placeholder="e.g. S5 ECE" />
        {state.fieldErrors?.batch && (
          <p className="text-body-sm text-ink-soft">{state.fieldErrors.batch[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Input id="notes" name="notes" placeholder="Bring the projector remote" />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Requesting..." : "Request booking"}
      </Button>
    </form>
  );
}
