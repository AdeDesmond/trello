"use client";

import { usePremiumModal } from "@/hooks/use-premium-modal";
import { Dialog, DialogContent } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

export const PremiumModal = () => {
  const premiumModal = usePremiumModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };
  return (
    <Dialog open={premiumModal.isOpen} onOpenChange={premiumModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.svg" alt="hero" className="object-cover" fill />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6 ">
          <h2 className="text-xl font-semibold">
            Upgrade to taskify pro today
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the best of taskify
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button
            disabled={isLoading}
            onClick={onClick}
            className="w-full"
            variant="primary"
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
