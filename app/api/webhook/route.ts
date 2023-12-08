import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new NextResponse("WebHook error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subcription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Org ID is required", { status: 400 });
    }

    await db.orgSubscription.create({
      data: {
        orgId: session?.metadata?.orgId,
        stripeSubscriptionId: subcription.id,
        stripeCustomerId: subcription.customer as string,
        stripePriceId: subcription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subcription.current_period_end * 1000),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subcription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await db.orgSubscription.update({
      where: {
        stripeSubscriptionId: subcription.id,
      },
      data: {
        stripePriceId: subcription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subcription.current_period_end * 1000),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
