"use server";

import { stripe } from "@/src/shared/api/stripe";

export const getCustomer = async ({ sessionId }: { sessionId: string }) => {
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
  return checkoutSession;
};

export const getCustomerById = async (customerId: string) => {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return customer;
  } catch (error) {
    return new Error(`error ${error}`);
  }
};
