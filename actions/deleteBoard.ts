/*

"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function del(id: string) {
  await db.board.delete({
    where: {
      id,
    },
  });
  revalidatePath("/organization/org_2YALDrTd7zWBmhO8Z7xWOBWMndm");
}

*/
