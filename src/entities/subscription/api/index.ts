'use server'

import { stripe } from "@/src/shared/api/stripe";
import Stripe from "stripe";

export const getStripeSubscription = async ({ customerId }: { customerId: string }): Promise<Stripe.Subscription & { plan?: Stripe.Plan }> => {
    try {
        const subscription = (await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'active' })).data[0] as Stripe.Subscription & { plan?: Stripe.Plan }
        return subscription
    } catch (error) {
        throw error;
    }
}

export const updateStripeSubscription = async ({ customerId, priceId, }: { customerId: string, priceId: string }) => {
    try {
        const subscription = (await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'active' })).data[0];
        const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
            items: [
                {
                    id: subscription.items.data[0].id,
                    price: priceId,
                },
            ],
            proration_behavior: 'create_prorations',
        })
        return {
            success: true,
            message: 'Subscription updated successfully!',
            invoiceId: updatedSubscription.latest_invoice,
        };
    } catch (error) {
        throw error;
    }
}

export const removeStripeSubscription = async (customerId: string): Promise<{ canceledAt: number }> => {
    try {
        const subscription = await getStripeSubscription({ customerId });
        if (!subscription) {
            throw new Error(`No active subscription found for customer ID: ${customerId}`);
        }
        const canceledSubscription = await stripe.subscriptions.cancel(subscription.id);
        return {
            canceledAt: canceledSubscription.canceled_at as number,
        };
    } catch (error) {
        console.error("Error canceling subscription:", error);
        throw error;
    }
};