"use server";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { auth, currentUser } from "@clerk/nextjs";
import { StripeRedirect } from "./schema";
import { InputType, Returntype } from "./types";
import { revalidatePath } from "next/cache";
import { createAuditLog } from "@/lib/create-aufit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { absoluteUrl } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

const handler = async (data: InputType): Promise<Returntype> => {
  const { userId, orgId } = await auth();
  const user = await currentUser();

  if (!userId || !orgId) {
    return {
      error: "Unathorised",
    };
  }

  if (!user) {
    throw new Error("unathorised");
  }
  const settingsUrl = absoluteUrl(`/organization/${orgId}`);
  let url = "";
  try {
    const orgSubscription = await db.orgSubscription.findUnique({
      where: {
        orgId,
      },
    });

    if (orgSubscription && orgSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: orgSubscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = stripeSession.url;
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
        line_items: [
          {
            price_data: {
              currency: "USD",
              product_data: {
                name: "Taskify Pro",
                description: "umlimted boards for your ogranisation",
              },
              unit_amount: 2000,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          orgId,
        },
      });
      url = stripeSession.url || "";
    }
  } catch (error) {
    return {
      error: "something went wrong",
    };
  }
  revalidatePath(`/organization/${orgId}`);
  return { data: url };
};

export const stripeRedirect = createSafeAction(StripeRedirect, handler);
