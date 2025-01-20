'use server'

import { getUserById, editUser } from "@/src/entities/user";
import { stripe } from "@/src/shared/api/stripe";
import { BASE_URL } from "@/src/shared/const/baseUrl";
import Stripe from "stripe";

export const createCheckoutSession = async ({
    priceId,
    subscription,
    userId,
}: {
    priceId: string;
    subscription: string;
    userId: string;
}) => {
    try {
        if (!userId) {
            throw new Error("User ID not found in URL");
        }

        const user = await getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const customers = await stripe.customers.list({ email: user.email });
        let customerId: string;

        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        } else {
            const customerParams: Stripe.CustomerCreateParams = {
                email: user.email,
                // metadata: { userId: userId.toString() },
            };

            const newCustomer = await stripe.customers.create(customerParams);
            customerId = newCustomer.id;
        }

        await editUser({ customerId, email: user.email });

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            metadata: { subscription },
            mode: "subscription",
            success_url:  `${BASE_URL}/subscription-activate-info`,
            cancel_url:  `${BASE_URL}/subscription-activate-info`,
            allow_promotion_codes: true,
        });

        return {
            url: session.url,
        };
    } catch (error) {
        console.error(error);
        throw error;
    }
};