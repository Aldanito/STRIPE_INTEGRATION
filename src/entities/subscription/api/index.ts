'use server'

import { stripe } from "@/src/shared/api/stripe";
import Stripe from "stripe";
import {  updateSubscriptionEndsAt } from "@/src/entities/user";

export const getStripeSubscription = async ({ customerId }: { customerId: string }): Promise<Stripe.Subscription & { plan?: Stripe.Plan }> => {
    try {
        const subscription = (await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'active' })).data[0] as Stripe.Subscription & { plan?: Stripe.Plan }
        return subscription
    } catch (error) {
        throw error;
    }
}

export const getStripeSubscriptionByEmail = async (email: string): Promise<Stripe.Subscription | null> => {
  try {
    const customers = await stripe.customers.list({
      email: email,
    });

    if (customers.data.length === 0) {
      console.error('No customer found with the provided email.');
      return null;
    }

    const customerId = customers.data[0].id;

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
    });

    return subscriptions.data.length > 0 ? subscriptions.data[0] : null;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
};

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
        });

        const subscriptionEndsAt = updatedSubscription.current_period_end ? new Date(updatedSubscription.current_period_end * 1000).toISOString() : null;
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) {
            await updateSubscriptionEndsAt({ email: customer.email || '', subscriptionEndsAt: subscriptionEndsAt || '' });
        }

        return {
            success: true,
            message: 'Subscription updated successfully!',
            invoiceId: updatedSubscription.latest_invoice,
            subscriptionEndsAt,
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
        const customer = await stripe.customers.retrieve(customerId);
        if (!customer.deleted) {
            await updateSubscriptionEndsAt({ email: customer.email || '', subscriptionEndsAt: null  });
        }
        return {
            canceledAt: canceledSubscription.canceled_at as number,
        };
    } catch (error) {
        console.error("Error canceling subscription:", error);
        throw error;
    }
};