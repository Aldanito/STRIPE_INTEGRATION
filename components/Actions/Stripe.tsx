'use server'
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const getCustomer = async ({ sessionId }: { sessionId: string }) => {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    return checkoutSession
}

export const createPortalSession = async ({ customerId }: { customerId: string }) => {
    const returnUrl = 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
    });

    return portalSession
};

export const createCheckoutSession = async ({ userId, email, priceId, subscription }: { userId: number, email: string, priceId: string, subscription: string }) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            metadata: { userId, email, subscription },
            mode: "subscription",
            success_url: `http://localhost:3000/paymentStatus?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/paymentStatus?status=cancel`,
            allow_promotion_codes: true,
            customer_email: email
        });

        return session

    } catch (error) {
        console.error("Error creating checkout session:", error);
    }
}