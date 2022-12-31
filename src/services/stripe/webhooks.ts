import { stripe } from "../../stripe";
import Stripe from "stripe";
import { Request, Response } from "express";

const webhookHandlers = {
    'customer.subscription.created': async (data: Stripe.Subscription) => {
        console.log('Customer subscription created\n' + JSON.stringify(data, null, 4));
    },
    'customer.subscription.updated': async (data: Stripe.Subscription) => {
        console.log('Customer subscription updated\n' + JSON.stringify(data, null, 4));
    },
    'customer.subscription.deleted': async (data: Stripe.Subscription) => {
        console.log('Customer subscription deleted\n' + JSON.stringify(data, null, 4));
    },
    'payment_intent.succeeded': async (data: Stripe.PaymentIntent) => {
        console.log('Payment intent succeeded\n' + JSON.stringify(data, null, 4));
    },
    'payment_intent.payment_failed': async (data: Stripe.PaymentIntent) => {
        console.log('Payment intent failed\n' + JSON.stringify(data, null, 4));
    }
};

export async function handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;
    const event = stripe.webhooks.constructEvent(req['rawBody'], sig, process.env.STRIPE_WEBHOOK_SECRET);

    try {
        if (event.type in webhookHandlers) {
            await webhookHandlers[event.type](event.data.object);
            res.send({ received: true });
        } else {
            console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send(`Webhook Error: ${(error as any).message}`);
    }
}
