'use server'

import { stripe } from "@/src/shared/api/stripe";
import { BASE_URL } from "@/src/shared/const/baseUrl";


export const createPortalSession = async ({ customerId }: { customerId: string }) => {
    try {
        const returnUrl = `${BASE_URL}/paymentStatus`;

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });

        return (portalSession)

    } catch (error) {
        return { error: error }
    }
};