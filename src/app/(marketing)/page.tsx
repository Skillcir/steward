import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-3xl px-4 py-[120px] text-center">
      <h1 className="text-heading-1 text-ink">
        Book rooms and equipment without the back-and-forth.
      </h1>
      <p className="text-body-lg mt-4 text-text-muted">
        Steward keeps every shared resource — rooms, gear, desks — on one
        calendar so double-bookings never happen.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/resources">Browse resources</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
