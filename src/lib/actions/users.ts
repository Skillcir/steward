"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { roleAssignmentSchema } from "@/lib/validations";

export async function setUserRole(userId: string, role: string) {
  await requireAdmin();

  const parsed = roleAssignmentSchema.safeParse(role);
  if (!parsed.success) {
    throw new Error("Invalid role.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.data },
  });

  revalidatePath("/admin/users");
}
