import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "@/components/booking-form";
import { format } from "date-fns";

export default async function ResourceDetailPage({
  params,
}: PageProps<"/resources/[id]">) {
  await requireUser();

  const { id } = await params;

  const resource = await prisma.resource.findUnique({
    where: { id },
    include: {
      bookings: {
        where: { status: "CONFIRMED", endTime: { gte: new Date() } },
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!resource) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-heading-3 text-ink">{resource.name}</h1>
          {resource.location && (
            <p className="text-body text-text-muted">{resource.location}</p>
          )}
        </div>
        <Badge variant="secondary">Capacity {resource.capacity}</Badge>
      </div>

      {resource.description && (
        <p className="text-body-sm mb-8 text-text-muted">
          {resource.description}
        </p>
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-title mb-3 text-ink">Book this resource</h2>
          <BookingForm resourceId={resource.id} />
        </div>

        <div>
          <h2 className="text-title mb-3 text-ink">Upcoming bookings</h2>
          {resource.bookings.length === 0 ? (
            <p className="text-body-sm text-text-muted">
              No upcoming bookings.
            </p>
          ) : (
            <ul className="space-y-2">
              {resource.bookings.map((booking) => (
                <li
                  key={booking.id}
                  className="text-body-sm rounded-sm bg-canvas-soft px-3 py-2"
                >
                  <div className="font-medium text-ink">{booking.title}</div>
                  <div className="text-text-muted">
                    {format(booking.startTime, "MMM d, h:mm a")} –{" "}
                    {format(booking.endTime, "h:mm a")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
