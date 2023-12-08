import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/info";
import { ActivityList } from "./_components/activity-list";
import { Suspense } from "react";
import { checksubscription } from "@/lib/subscription";

export default async function ActivityPage() {
  const isPremium = await checksubscription();
  return (
    <div className="w-full">
      <Info isPremium={isPremium} />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
}
