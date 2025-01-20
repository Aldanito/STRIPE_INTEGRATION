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