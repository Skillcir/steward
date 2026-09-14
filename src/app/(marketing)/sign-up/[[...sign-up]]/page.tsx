import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center py-10">
      <SignUp appearance={clerkAppearance} />
    </div>
  );
}
