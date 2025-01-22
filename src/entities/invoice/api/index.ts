'use server'

import { stripe } from "@/src/shared/api/stripe";

export const getStripeInvoice = async (invoiceId: string): Promise<{ invoiceUrl: string, invoicePdf: string }> => {
    try {
        const invoice = await stripe.invoices.retrieve(invoiceId as string);
        return {
            invoiceUrl: invoice.hosted_invoice_url as string,
            invoicePdf: invoice.invoice_pdf as string,
        }
    } catch (error) {
        throw error
    }

} 


export const getStripeInvoiceFromCheckoutSession = async (checkoutSessionId: string) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);

        if (!session || !session.subscription) {
            throw new Error("Subscription not found in the session.");
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!subscription.latest_invoice) {
            throw new Error("Latest invoice not found.");
        }

        const invoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);

        const invoiceUrl = invoice.hosted_invoice_url ?? "";
        const invoicePdf = invoice.invoice_pdf ?? "";

        if (!invoiceUrl || !invoicePdf) {
            throw new Error("Invoice URLs are missing.");
        }

        return {
            invoiceUrl,
            invoicePdf,
        };
    } catch (error) {
        console.error("Error fetching the invoice:", error);
        throw error;
    }
};
