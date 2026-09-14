import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateCurrentUser } from "@/lib/users";
import { OnboardingForm } from "@/components/onboarding-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/sign-in");

  if (user.name && user.dept) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete your profile</CardTitle>
        </CardHeader>
        <CardContent>
          <OnboardingForm email={user.email} defaultName={user.name} />
        </CardContent>
      </Card>
    </div>
  );
}
