import { z } from "zod";
import { List } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CreatList } from "./schema";

export type InputType = z.infer<typeof CreatList>;

export type ReturnType = ActionState<InputType, List>;
