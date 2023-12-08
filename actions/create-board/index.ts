"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoardSchema } from "./schema";
import { createAuditLog } from "@/lib/create-aufit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { increaseAvailableCount, hasavailableCount } from "@/lib/org-limit";
import { checksubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) {
    return {
      error: "unauthorised",
    };
  }
  const canCreate = await hasavailableCount();
  const isPremium = await checksubscription();
  if (!canCreate && !isPremium) {
    return {
      error:
        "You have reached your limit of free boards, please upgrade to create more ",
    };
  }
  const { title, image } = data;
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "invalid image failed to create board",
    };
  }
  let board;
  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      },
    });

    if (!isPremium) {
      await increaseAvailableCount();
    }
    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "board creation failed",
    };
  }
  revalidatePath(`/board/${board.id}`);
  return {
    data: board,
  };
};

export const createBoard = createSafeAction(CreateBoardSchema, handler);
