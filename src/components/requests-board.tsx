"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format, isThisWeek } from "date-fns";
import {
  ArrowUpDown,
  Ban,
  CheckCircle2,
  Clock,
  FileText,
  MoreVertical,
  Search,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "cn";
import { BookingRequestActions } from "@/components/booking-request-actions";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type RequestStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export type RequestRow = {
  id: string;
  title: string;
  batch: string | null;
  resourceId: string;
  resourceName: string;
  startTime: Date;
  endTime: Date;
  status: RequestStatus;
  requestedByName: string;
  requestedByDept: string | null;
  requestedByEmail: string | null;
};

const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-orange-50 text-orange-700",
  },
  CONFIRMED: {
    label: "Approved",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-50 text-red-700",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: Ban,
    className: "bg-canvas-soft text-text-muted",
  },
};

function StatusBadge({ status }: { status: RequestStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-caption font-medium",
        config.className
      )}
    >
      <Icon className="size-3.5" />
      {config.label}
    </span>
  );
}

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];
type SortOrder = "latest" | "oldest";
type DateRange = "week" | "all";

export function RequestsBoard({ requests }: { requests: RequestRow[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("ALL");
  const [sort, setSort] = useState<SortOrder>("latest");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  const counts = useMemo(
    () => ({
      ALL: requests.length,
      PENDING: requests.filter((r) => r.status === "PENDING").length,
      CONFIRMED: requests.filter((r) => r.status === "CONFIRMED").length,
      REJECTED: requests.filter((r) => r.status === "REJECTED").length,
    }),
    [requests]
  );

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = requests.filter((r) => {
      if (filter !== "ALL" && r.status !== filter) return false;
      if (dateRange === "week" && !isThisWeek(r.startTime)) return false;
      if (!query) return true;

      const haystack = [
        r.title,
        r.resourceName,
        r.requestedByName,
        r.requestedByDept,
        r.requestedByEmail,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    return filtered.sort((a, b) =>
      sort === "latest"
        ? b.startTime.getTime() - a.startTime.getTime()
        : a.startTime.getTime() - b.startTime.getTime()
    );
  }, [requests, search, filter, dateRange, sort]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-faint" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests, rooms, or email..."
            className="pl-8"
          />
        </div>
        <Select
          value={dateRange}
          onValueChange={(v) => setDateRange(v as DateRange)}
        >
          <SelectTrigger className="w-full sm:w-auto">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-body-sm transition-colors",
                filter === f.value
                  ? "bg-ink text-on-primary"
                  : "bg-canvas-soft text-ink hover:bg-hairline-soft"
              )}
            >
              {f.label} ({counts[f.value]})
            </button>
          ))}
        </div>

        <Select value={sort} onValueChange={(v) => setSort(v as SortOrder)}>
          <SelectTrigger>
            <ArrowUpDown className="size-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {requests.length === 0 ? (
        <p className="text-body-sm text-text-muted">No requests yet.</p>
      ) : visible.length === 0 ? (
        <p className="text-body-sm text-text-muted">
          No requests match your filters.
        </p>
      ) : (
        <div className="rounded-md ring-1 ring-hairline-soft">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>Requested by</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-canvas-soft text-ink">
                        <FileText className="size-4" />
                      </div>
                      <div>
                        <div className="text-body-sm font-medium text-ink">
                          {r.title}
                        </div>
                        {r.batch && (
                          <div className="text-caption text-text-muted">
                            {r.batch}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-body-sm text-text-muted">
                    {r.resourceName}
                  </TableCell>
                  <TableCell>
                    <div className="text-body-sm text-ink">
                      {format(r.startTime, "MMM d, yyyy")}
                    </div>
                    <div className="text-caption text-text-muted">
                      {format(r.startTime, "h:mm a")} –{" "}
                      {format(r.endTime, "h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-body-sm text-ink">
                      {r.requestedByName}
                    </div>
                    {r.requestedByDept && (
                      <div className="text-caption text-text-muted">
                        {r.requestedByDept}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {r.status === "PENDING" ? (
                        <BookingRequestActions bookingId={r.id} />
                      ) : null}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="flex size-8 items-center justify-center rounded-sm text-text-muted hover:bg-canvas-soft"
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/resources/${r.resourceId}`}>
                              View resource
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(r.id);
                              toast.success("Request ID copied");
                            }}
                          >
                            Copy request ID
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
