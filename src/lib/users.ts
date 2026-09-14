import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";

function isBootstrapAdmin(email: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.toLowerCase());
}

export async function getOrCreateCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.primaryEmailAddress?.emailAddress ?? "";
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    null;

  const existingById = await prisma.user.findUnique({
    where: { id: clerkUser.id },
  });
  if (existingById) {
    // Only email is kept in sync with Clerk on every call. `name`/`dept` are
    // owned by the onboarding flow once set, and must not be clobbered back
    // to Clerk's (usually empty) name on later requests.
    return prisma.user.update({
      where: { id: clerkUser.id },
      data: { email },
    });
  }

  // No row for this Clerk id yet. If one already exists for this email
  // (e.g. the Clerk account was deleted and recreated, or the session moved
  // to a different Clerk environment), reconcile onto the new id instead of
  // failing on the email unique constraint.
  const existingByEmail = email
    ? await prisma.user.findUnique({ where: { email } })
    : null;
  if (existingByEmail) {
    return prisma.user.update({
      where: { email },
      data: { id: clerkUser.id },
    });
  }

  return prisma.user.create({
    data: {
      id: clerkUser.id,
      email,
      name,
      role: isBootstrapAdmin(email) ? "ADMIN" : "USER",
    },
  });
}

export async function getCurrentUserRole(): Promise<Role | null> {
  const user = await getOrCreateCurrentUser();
  return user?.role ?? null;
}
