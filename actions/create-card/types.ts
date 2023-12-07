import { z } from "zod";
import { Card } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { CreatCard } from "./schema";

export type InputType = z.infer<typeof CreatCard>;

export type ReturnType = ActionState<InputType, Card>;
