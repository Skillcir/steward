"use client";

import { OnboardingForm } from "@/components/onboarding-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function OnboardingModal({
  email,
  defaultName,
}: {
  email: string;
  defaultName: string | null;
}) {
  return (
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
        </DialogHeader>
        <OnboardingForm email={email} defaultName={defaultName} />
      </DialogContent>
    </Dialog>
  );
}
