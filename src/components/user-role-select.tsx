"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setUserRole } from "@/lib/actions/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UserRoleSelect({
  userId,
  role,
}: {
  userId: string;
  role: "USER" | "CUSTODIAN";
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={role}
      disabled={isPending}
      onValueChange={(value) => {
        startTransition(async () => {
          try {
            await setUserRole(userId, value);
            toast.success("Role updated");
          } catch {
            toast.error("Could not update role");
          }
        });
      }}
    >
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USER">User</SelectItem>
        <SelectItem value="CUSTODIAN">Custodian</SelectItem>
      </SelectContent>
    </Select>
  );
}
