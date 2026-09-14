import { startOfDay } from "date-fns";
import { CheckCircle2, Clock, Users, XCircle } from "lucide-react";
import { requireCustodianOrAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deptLabel } from "@/lib/depts";
import { StatCard } from "@/components/stat-card";
import { RequestsBoard, type RequestRow } from "@/components/requests-board";

export default async function BookingRequestsPage() {
  await requireCustodianOrAdmin();

  const startOfToday = startOfDay(new Date());

  const [requests, pendingCount, approvedToday, rejectedToday] =
    await Promise.all([
      prisma.booking.findMany({
        include: { resource: true },
        orderBy: [{ status: "asc" }, { startTime: "desc" }],
      }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({
        where: { status: "CONFIRMED", updatedAt: { gte: startOfToday } },
      }),
      prisma.booking.count({
        where: { status: "REJECTED", updatedAt: { gte: startOfToday } },
      }),
    ]);

  const requesters = await prisma.user.findMany({
    where: { id: { in: [...new Set(requests.map((b) => b.userId))] } },
  });
  const requesterById = new Map(requesters.map((u) => [u.id, u]));

  const rows: RequestRow[] = requests.map((booking) => {
    const requester = requesterById.get(booking.userId);
    return {
      id: booking.id,
      title: booking.title,
      batch: booking.batch,
      resourceId: booking.resourceId,
      resourceName: booking.resource.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      requestedByName: requester?.name ?? booking.userEmail ?? booking.userId,
      requestedByDept: requester?.dept
        ? deptLabel(requester.dept, requester.deptOther)
        : null,
      requestedByEmail: requester?.email ?? booking.userEmail,
    };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-body-sm text-text-muted">Welcome back</p>
          <h1 className="text-heading-3 text-ink">All requests</h1>
          <p className="text-body-sm mt-1 text-text-muted">
            Manage and review room booking requests
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pending requests"
          value={pendingCount}
          hint="Needs your action"
          icon={Clock}
          color="orange"
        />
        <StatCard
          label="Approved today"
          value={approvedToday}
          hint="Confirmed bookings"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          label="Rejected today"
          value={rejectedToday}
          hint={rejectedToday === 0 ? "No rejections" : "Declined bookings"}
          icon={XCircle}
          color="red"
        />
        <StatCard
          label="Total requests"
          value={requests.length}
          hint="All time"
          icon={Users}
          color="purple"
        />
      </div>

      <RequestsBoard requests={rows} />
    </div>
  );
}
