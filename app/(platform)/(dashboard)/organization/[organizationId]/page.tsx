import { create } from "@/actions/createBoard";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { Board } from "./_lessons/board";
import { Form } from "./_lessons/form";
import { Info } from "./_components/info";
import { Separator } from "@/components/ui/separator";
import { BoardList } from "./_components/boardlist";
import { Suspense } from "react";
import { checksubscription } from "@/lib/subscription";

export default async function OrganizationIdPage() {
  const isPremium = await checksubscription();
  return (
    <div className="w-full mb-20">
      <Info isPremium={isPremium} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
}
