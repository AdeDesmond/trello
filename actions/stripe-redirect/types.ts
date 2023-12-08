import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { StripeRedirect } from "./schema";

export type InputType = z.infer<typeof StripeRedirect>;
export type Returntype = ActionState<InputType, string>;
