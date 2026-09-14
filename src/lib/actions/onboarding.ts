"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/validations";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function completeOnboarding(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const parsed = onboardingSchema.safeParse({
    name: formData.get("name"),
    dept: formData.get("dept"),
    deptOther: formData.get("deptOther") ?? undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: parsed.data.name,
      dept: parsed.data.dept,
      deptOther: parsed.data.dept === "OTHER" ? parsed.data.deptOther : null,
    },
  });

  redirect("/dashboard");
}
