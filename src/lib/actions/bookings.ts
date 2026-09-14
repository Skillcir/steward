"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireCustodianOrAdmin } from "@/lib/auth";
import { bookingSchema } from "@/lib/validations";
import type { ActionState } from "@/lib/actions/resources";

export async function createBooking(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "You must be signed in to book a resource." };
  }

  const parsed = bookingSchema.safeParse({
    resourceId: formData.get("resourceId"),
    title: formData.get("title"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    notes: formData.get("notes"),
    batch: formData.get("batch"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { resourceId, title, startTime, endTime, notes, batch } = parsed.data;

  const overlapping = await prisma.booking.findFirst({
    where: {
      resourceId,
      status: "CONFIRMED",
      startTime: { lt: endTime },
      endTime: { gt: startTime },
    },
  });

  if (overlapping) {
    return {
      error: "This resource is already booked for part of that time range.",
    };
  }

  const user = await currentUser();

  await prisma.booking.create({
    data: {
      resourceId,
      title,
      startTime,
      endTime,
      notes: notes || null,
      batch: batch || null,
      userId,
      userEmail: user?.primaryEmailAddress?.emailAddress ?? null,
      status: "PENDING",
    },
  });

  revalidatePath(`/resources/${resourceId}`);
  revalidatePath("/dashboard");
  revalidatePath("/admin/bookings");

  return { ok: true };
}

export async function approveBooking(bookingId: string) {
  await requireCustodianOrAdmin();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== "PENDING") {
    throw new Error("Request not found.");
  }

  const overlapping = await prisma.booking.findFirst({
    where: {
      id: { not: booking.id },
      resourceId: booking.resourceId,
      status: "CONFIRMED",
      startTime: { lt: booking.endTime },
      endTime: { gt: booking.startTime },
    },
  });

  if (overlapping) {
    throw new Error(
      "Another booking already confirmed for part of that time range."
    );
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED" },
  });

  revalidatePath(`/resources/${booking.resourceId}`);
  revalidatePath("/dashboard");
  revalidatePath("/admin/bookings");
}

export async function rejectBooking(bookingId: string) {
  await requireCustodianOrAdmin();

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.status !== "PENDING") {
    throw new Error("Request not found.");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "REJECTED" },
  });

  revalidatePath(`/resources/${booking.resourceId}`);
  revalidatePath("/dashboard");
  revalidatePath("/admin/bookings");
}

export async function cancelBooking(bookingId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be signed in to cancel a booking.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.userId !== userId) {
    throw new Error("Booking not found.");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  revalidatePath(`/resources/${booking.resourceId}`);
  revalidatePath("/dashboard");
}
