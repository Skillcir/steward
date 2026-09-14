import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/users";
import type { Role } from "@/generated/prisma/client";

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/sign-in");

  if (!user.name || !user.dept) redirect("/onboarding");

  return user;
}

export async function requireRole(roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) redirect("/");

  return user;
}

export function requireAdmin() {
  return requireRole(["ADMIN"]);
}

export function requireCustodianOrAdmin() {
  return requireRole(["ADMIN", "CUSTODIAN"]);
}
