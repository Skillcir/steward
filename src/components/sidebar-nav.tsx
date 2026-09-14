import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUserRole } from "@/lib/users";
import { SidebarNavLinks } from "@/components/sidebar-nav-links";

export async function SidebarNav() {
  const role = await getCurrentUserRole();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/resources", label: "Resources" },
    ...(role === "ADMIN" || role === "CUSTODIAN"
      ? [{ href: "/admin/bookings", label: "Requests" }]
      : []),
    ...(role === "ADMIN" ? [{ href: "/admin/users", label: "Admin" }] : []),
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col justify-between border-r border-hairline-soft bg-canvas px-4 py-6">
      <div>
        <Link href="/" className="text-heading-4 mb-8 block px-3 text-ink">
          Steward
        </Link>
        <SidebarNavLinks links={links} />
      </div>
      <div className="flex items-center gap-2 px-3">
        <UserButton />
        <span className="text-body-sm text-text-muted">Account</span>
      </div>
    </aside>
  );
}
