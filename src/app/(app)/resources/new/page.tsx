import { requireCustodianOrAdmin } from "@/lib/auth";
import { NewResourceForm } from "@/components/new-resource-form";

export default async function NewResourcePage() {
  await requireCustodianOrAdmin();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-heading-3 text-ink">Add a resource</h1>
      <p className="text-body mb-6 text-text-muted">
        Rooms, desks, or equipment other people can book.
      </p>
      <NewResourceForm />
    </div>
  );
}
