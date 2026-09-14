import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUser } from "@/lib/users";
import { CancelBookingButton } from "@/components/cancel-booking-button";
import { OnboardingModal } from "@/components/onboarding-modal";
import { Badge } from "@/components/ui/badge";
import { StatTile } from "@/components/stat-tile";

const STATUS_LABEL = {
  PENDING: "Pending approval",
  CONFIRMED: "Confirmed",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
} as const;

function StatusBadge({
  status,
}: {
  status: keyof typeof STATUS_LABEL;
}) {
  return (
    <Badge
      variant={
        status === "CONFIRMED"
          ? "default"
          : status === "PENDING"
            ? "secondary"
            : "outline"
      }
    >
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/sign-in");

  if (!user.name || !user.dept) {
    return <OnboardingModal email={user.email} defaultName={user.name} />;
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: user.id },
    include: { resource: true },
    orderBy: { startTime: "asc" },
  });

  const now = new Date();
  const upcoming = bookings.filter((b) => b.endTime >= now);
  const past = bookings.filter((b) => b.endTime < now);
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-heading-3 mb-6 text-ink">Your bookings</h1>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <StatTile label="Upcoming bookings" value={upcoming.length} />
        <StatTile label="Pending requests" value={pendingCount} />
        <StatTile label="Past bookings" value={past.length} />
      </div>

      <section className="mb-10">
        <h2 className="text-title mb-3 text-ink">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-body-sm text-text-muted">No upcoming bookings.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((booking) => (
              <li
                key={booking.id}
                className="flex items-center justify-between rounded-md bg-canvas px-4 py-3 ring-1 ring-hairline-soft"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-body font-medium text-ink">
                      {booking.title}
                    </span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="text-body-sm text-text-muted">
                    {booking.resource.name} ·{" "}
                    {format(booking.startTime, "MMM d, h:mm a")} –{" "}
                    {format(booking.endTime, "h:mm a")}
                    {booking.batch && ` · ${booking.batch}`}
                  </div>
                </div>
                {(booking.status === "PENDING" ||
                  booking.status === "CONFIRMED") && (
                  <CancelBookingButton bookingId={booking.id} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-title mb-3 text-ink">Past</h2>
          <ul className="space-y-2">
            {past.map((booking) => (
              <li
                key={booking.id}
                className="flex items-center justify-between rounded-md bg-canvas px-4 py-3 opacity-60 ring-1 ring-hairline-soft"
              >
                <div>
                  <div className="text-body font-medium text-ink">
                    {booking.title}
                  </div>
                  <div className="text-body-sm text-text-muted">
                    {booking.resource.name} ·{" "}
                    {format(booking.startTime, "MMM d, h:mm a")}
                  </div>
                </div>
                <StatusBadge status={booking.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
