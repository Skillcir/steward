import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getCurrentUserRole } from "@/lib/users";

export async function SiteHeader() {
  const role = await getCurrentUserRole();

  return (
    <header className="sticky top-4 z-40 mx-auto w-fit">
      <div className="flex items-center gap-6 rounded-full bg-canvas-soft px-5 py-2.5">
        <Link href="/" className="text-title text-ink">
          Steward
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/resources"
            className="text-link text-text-muted hover:text-ink"
          >
            Resources
          </Link>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-link text-text-muted hover:text-ink"
            >
              Dashboard
            </Link>
          </Show>
          {(role === "ADMIN" || role === "CUSTODIAN") && (
            <Link
              href="/admin/bookings"
              className="text-link text-text-muted hover:text-ink"
            >
              Requests
            </Link>
          )}
          {role === "ADMIN" && (
            <Link
              href="/admin/users"
              className="text-link text-text-muted hover:text-ink"
            >
              Admin
            </Link>
          )}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm">Sign up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}
