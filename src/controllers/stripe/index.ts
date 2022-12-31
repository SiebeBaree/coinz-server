import { Request, Response } from "express"
import { createStripeCheckoutSession } from "../../services/stripe"
import { handleStripeWebhook } from "../../services/stripe/webhooks";

export async function checkoutsController(req: Request, res: Response) {
    const { session, error } = await createStripeCheckoutSession(req.body.item);

    if (error) {
        return res.status(400).json({ error: error });
    } else {
        return res.send(session);
    }
}

export async function subscribeController(req: Request, res: Response) {

}

export async function webhookController(req: Request, res: Response) {
    await handleStripeWebhook(req, res);
}