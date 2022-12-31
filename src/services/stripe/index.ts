import { stripe } from "../../stripe";
import Stripe from "stripe";

const premiumTiers = {
    "premium-1": {
        name: "Coinz Premium",
        price: 200,
        interval: "month" as Stripe.Price.Recurring.Interval,
        interval_count: 1
    }
}

interface ShoppingCartItem {
    id: string;
    quantity: number;
};

export async function createStripeCheckoutSession(
    item: ShoppingCartItem
): Promise<{ session: Stripe.Checkout.Session, error?: string }> {
    try {
        // Check what item is being purchased
        if (item.id.startsWith("premium")) {
            const premiumTier = premiumTiers[item.id];

            if (!premiumTier) {
                return { session: undefined, error: "Invalid premium tier" };
            }

            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: premiumTier.name,
                            },
                            recurring: {
                                interval: premiumTier.interval,
                                interval_count: premiumTier.interval_count
                            },
                            unit_amount: premiumTier.price
                        },
                        quantity: 1
                    }
                ],
                mode: "subscription",
                success_url: `${process.env.WEBAPP_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.WEBAPP_URL}/store/cancel`
            });

            return { session: session, error: undefined };
        } else if (item.id === "tickets") {
            const ticketAmount = item.quantity;

            if (isNaN(ticketAmount) || ticketAmount < 100 || ticketAmount > 1500) {
                return { session: undefined, error: "Invalid ticket amount" };
            }

            const session = await stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: `${ticketAmount} Tickets`,
                            },
                            unit_amount: ticketAmount
                        },
                        quantity: 1
                    }
                ],
                mode: "payment",
                success_url: `${process.env.WEBAPP_URL}/store/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.WEBAPP_URL}/store/cancel`
            });

            return { session: session, error: undefined };
        } else {
            return { session: undefined, error: "Invalid item id" };
        }
    } catch {
        return { session: undefined, error: "Something went wrong" };
    }
}