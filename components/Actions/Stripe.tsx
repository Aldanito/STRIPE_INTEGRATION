'use server'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia',
});

const BASE_URL = process.env.BASE_URL as string;

export const getCustomer = async ({ sessionId }: { sessionId: string }) => {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    return JSON.parse(JSON.stringify(checkoutSession));
}

export const createPortalSession = async ({ customerId }: { customerId: string }) => {
    const returnUrl = `${BASE_URL}/paymentStatus`;

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    return JSON.parse(JSON.stringify(portalSession));
};

export const createCheckoutSession = async ({ userId, email, priceId, subscription }: { userId: number, email: string, priceId: string, subscription: string }) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            metadata: { userId, email, subscription },
            mode: "subscription",
            success_url: `${BASE_URL}/paymentStatus?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/paymentStatus?status=cancel`,
            allow_promotion_codes: true,
            customer_email: email
        });

        return JSON.parse(JSON.stringify(session));

    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error;
    }
}