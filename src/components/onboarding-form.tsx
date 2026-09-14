"use client";

import { useActionState, useState } from "react";
import {
  completeOnboarding,
  type ActionState,
} from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEPTS } from "@/lib/depts";
import type { Dept } from "@/generated/prisma/client";

const initialState: ActionState = {};

export function OnboardingForm({
  email,
  defaultName,
}: {
  email: string;
  defaultName: string | null;
}) {
  const [state, formAction, isPending] = useActionState(
    completeOnboarding,
    initialState
  );
  const [dept, setDept] = useState<Dept | "">("");

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <p className="text-body-sm text-ink-soft">{state.error}</p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled readOnly />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Jane Doe"
          defaultValue={defaultName ?? ""}
          required
        />
        {state.fieldErrors?.name && (
          <p className="text-body-sm text-ink-soft">{state.fieldErrors.name[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dept">Department</Label>
        <Select
          name="dept"
          value={dept}
          onValueChange={(value) => setDept(value as Dept)}
          required
        >
          <SelectTrigger id="dept" className="w-full">
            <SelectValue placeholder="Select your department" />
          </SelectTrigger>
          <SelectContent>
            {DEPTS.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.fieldErrors?.dept && (
          <p className="text-body-sm text-ink-soft">{state.fieldErrors.dept[0]}</p>
        )}
      </div>

      {dept === "OTHER" && (
        <div className="space-y-1.5">
          <Label htmlFor="deptOther">Please specify</Label>
          <Input
            id="deptOther"
            name="deptOther"
            placeholder="Your department"
            required
          />
          {state.fieldErrors?.deptOther && (
            <p className="text-body-sm text-ink-soft">
              {state.fieldErrors.deptOther[0]}
            </p>
          )}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Continue"}
      </Button>
    </form>
  );
}
