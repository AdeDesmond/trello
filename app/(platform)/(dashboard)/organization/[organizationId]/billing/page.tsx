import { checksubscription } from "@/lib/subscription";
import { Info } from "../_components/info";
import { Separator } from "@/components/ui/separator";
import { SubscriptionButton } from "./_components/subcription-button";

export default async function BillingPage() {
  const isPremium = await checksubscription();
  return (
    <div className="w-full">
      <Info isPremium={isPremium} />
      <Separator className="my-2" />
      <SubscriptionButton isPremium={isPremium} />
    </div>
  );
}
