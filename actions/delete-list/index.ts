"use server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@clerk/nextjs";
import { DeleteList } from "./schema";
import { InputType, Returntype } from "./types";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-aufit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<Returntype> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unathorised",
    };
  }

  const { id, boardId } = data;

  let list;
  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
    });
    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: "failed to delete",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const deleteList = createSafeAction(DeleteList, handler);
