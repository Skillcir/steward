"use client";

import { useActionState } from "react";
import { createResource, type ActionState } from "@/lib/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: ActionState = {};

export function NewResourceForm() {
  const [state, formAction, isPending] = useActionState(
    createResource,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="text-body-sm text-ink-soft">{state.error}</p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" placeholder="Conference Room A" required />
        {state.fieldErrors?.name && (
          <p className="text-body-sm text-ink-soft">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input id="location" name="location" placeholder="3rd floor" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="capacity">Capacity</Label>
        <Input
          id="capacity"
          name="capacity"
          type="number"
          min={1}
          defaultValue={1}
          required
        />
        {state.fieldErrors?.capacity && (
          <p className="text-body-sm text-ink-soft">
            {state.fieldErrors.capacity[0]}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Projector, whiteboard, seats 8"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input id="imageUrl" name="imageUrl" placeholder="https://..." />
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating..." : "Create resource"}
      </Button>
    </form>
  );
}
