import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "cn";

const COLOR_STYLES = {
  orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600" },
  green: { bg: "bg-green-50", icon: "bg-green-100 text-green-600" },
  red: { bg: "bg-red-50", icon: "bg-red-100 text-red-600" },
  purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600" },
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: LucideIcon;
  color: keyof typeof COLOR_STYLES;
}) {
  const styles = COLOR_STYLES[color];

  return (
    <div className={cn("rounded-md px-5 py-4", styles.bg)}>
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            styles.icon
          )}
        >
          <Icon className="size-4.5" />
        </div>
        <ChevronRight className="size-4 text-text-faint" />
      </div>
      <div className="mt-3 text-label text-text-muted">{label}</div>
      <div className="text-heading-3 text-ink">{value}</div>
      <div className="text-caption mt-0.5 text-text-muted">{hint}</div>
    </div>
  );
}
