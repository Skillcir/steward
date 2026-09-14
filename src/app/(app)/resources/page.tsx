import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ResourcesPage() {
  const user = await requireUser();
  const canAddResource = user.role === "ADMIN" || user.role === "CUSTODIAN";

  const resources = await prisma.resource.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-heading-3 text-ink">Resources</h1>
          <p className="text-body text-text-muted">
            Rooms and equipment available to book.
          </p>
        </div>
        {canAddResource && (
          <Button asChild>
            <Link href="/resources/new">Add resource</Link>
          </Button>
        )}
      </div>

      {resources.length === 0 ? (
        <p className="text-body text-text-muted">
          No resources yet.
          {canAddResource && (
            <>
              {" "}
              <Link href="/resources/new" className="underline">
                Add the first one
              </Link>
              .
            </>
          )}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle>{resource.name}</CardTitle>
                  <Badge variant="secondary">Cap. {resource.capacity}</Badge>
                </div>
                {resource.location && (
                  <CardDescription>{resource.location}</CardDescription>
                )}
              </CardHeader>
              {resource.description && (
                <CardContent>
                  <p className="text-body-sm line-clamp-3 text-text-muted">
                    {resource.description}
                  </p>
                </CardContent>
              )}
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/resources/${resource.id}`}>View & book</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
