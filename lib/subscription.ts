import { auth } from "@clerk/nextjs";
import { db } from "./db";

const DAY_IN_MS = 86_400_000;

export const checksubscription = async () => {
  const { orgId } = await auth();
  if (!orgId) {
    return false;
  }
  const orgSubscription = await db.orgSubscription.findUnique({
    where: {
      orgId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!orgSubscription) {
    return false;
  }

  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return !!isValid; //!!isvalid turns this return expression into a boolean
};
