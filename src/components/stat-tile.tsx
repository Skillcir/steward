export function StatTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md bg-canvas-soft px-5 py-4">
      <div className="text-label text-text-muted">{label}</div>
      <div className="text-heading-3">{value}</div>
    </div>
  );
}
