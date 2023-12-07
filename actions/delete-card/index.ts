"use server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { auth } from "@clerk/nextjs";
import { DeleteCard } from "./schema";
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

  let card;
  try {
    card = await db.card.delete({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });
    await createAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: "failed to delete",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);
