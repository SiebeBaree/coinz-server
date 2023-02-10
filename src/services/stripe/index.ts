import { Request, Response } from "express";
import { stripe } from "../../stripe";
import Stripe from "stripe";
import Premium from "../../models/Premium";
import Member from "../../models/Member";

const webhookHandlers = {
    "checkout.session.completed": async (session: Stripe.Checkout.Session) => {
        if (session.metadata.tickets === "true") {
            await Member.findOneAndUpdate(
                { id: session.client_reference_id },
                { $inc: { tickets: Number(session.amount_subtotal) } },
                { upsert: true },
            );
            return;
        }

        const user = await Premium.findOne({ id: session.client_reference_id });

        if (!user) {
            try {
                const premiumFields = {
                    id: session.client_reference_id,
                    userTier: session.metadata.isUser === "true" ? Number(session.metadata.tier) : 0,
                    guildTier: session.metadata.isUser === "false" ? Math.floor(Number(session.amount_subtotal) / 300) : 0,
                    userExpires: session.metadata.isUser === "true" ? addDays(33) : 0,
                    guildExpires: session.metadata.isUser === "false" ? addDays(33) : 0,
                };

                const newUser = new Premium(premiumFields);
                await newUser.save();
            } catch (err) {
                console.error(err);
            }
        } else {
            await Premium.findOneAndUpdate({ id: session.client_reference_id }, {
                userTier: session.metadata.isUser === "true" ? Number(session.metadata.tier) : user.userTier,
                guildTier: session.metadata.isUser === "false" ? Math.floor(Number(session.amount_subtotal) / 300) : user.guildTier,
                userExpires: session.metadata.isUser === "true" ? addDays(33) : user.userExpires,
                guildExpires: session.metadata.isUser === "false" ? addDays(33) : user.guildExpires,
            }, { upsert: true });
        }
    },
    // "customer.subscription.created": async (subscription: Stripe.Subscription) => {
    //     // soon
    // },
    // "customer.subscription.updated": async (subscription: Stripe.Subscription) => {
    //     // soon
    // },
    // "customer.subscription.deleted": async (subscription: Stripe.Subscription) => {
    //     // soon
    // },
};

function addDays(days: number, timestamp?: number) {
    const date = timestamp ? new Date(timestamp * 1000) : new Date();
    date.setDate(date.getDate() + days);
    return Math.floor(date.getTime() / 1000);
}

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    try {
        if (!webhookHandlers[event.type]) {
            throw new Error("Unhandled Stripe event.");
        }

        await webhookHandlers[event.type](event.data.object);
        res.status(200).send({ received: true });
    } catch (err) {
        res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }
};
