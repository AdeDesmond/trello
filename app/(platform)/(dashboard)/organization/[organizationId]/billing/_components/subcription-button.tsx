"use client";

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { usePremiumModal } from "@/hooks/use-premium-modal";
import { toast } from "sonner";

interface SubscriptionButtonProps {
  isPremium: boolean;
}

export const SubscriptionButton = ({ isPremium }: SubscriptionButtonProps) => {
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
    if (isPremium) {
      execute({});
    } else {
      premiumModal.onOpen();
    }
  };
  return (
    <Button onClick={onClick} disabled={isLoading} variant="primary">
      {isPremium ? " Manange subscription" : "Upgrade to pro"}
    </Button>
  );
};
