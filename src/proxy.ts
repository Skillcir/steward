import { clerkMiddleware } from "@clerk/nextjs/server";

// Route protection lives in each page/action via `auth()` + `redirect()`
// (resource-based checks) rather than path matching here, per Clerk's
// guidance — path matching can diverge from how Next.js actually routes
// requests, and Server Actions on an "excluded" path would skip the check
// entirely. This proxy only needs to establish the auth context.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
