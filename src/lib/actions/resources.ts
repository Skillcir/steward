"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { resourceSchema } from "@/lib/validations";
import { getOrCreateCurrentUser } from "@/lib/users";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  ok?: boolean;
};

export async function createResource(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await getOrCreateCurrentUser();
  if (!user) {
    return { error: "You must be signed in to add a resource." };
  }
  if (user.role !== "ADMIN" && user.role !== "CUSTODIAN") {
    return { error: "You don't have permission to add resources." };
  }

  const parsed = resourceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    location: formData.get("location"),
    capacity: formData.get("capacity"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const resource = await prisma.resource.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      location: parsed.data.location || null,
      capacity: parsed.data.capacity,
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  revalidatePath("/resources");
  redirect(`/resources/${resource.id}`);
}

export async function deleteResource(resourceId: string) {
  const user = await getOrCreateCurrentUser();
  if (!user) {
    throw new Error("You must be signed in to delete a resource.");
  }
  if (user.role !== "ADMIN" && user.role !== "CUSTODIAN") {
    throw new Error("You don't have permission to delete resources.");
  }

  await prisma.resource.delete({ where: { id: resourceId } });
  revalidatePath("/resources");
  redirect("/resources");
}
