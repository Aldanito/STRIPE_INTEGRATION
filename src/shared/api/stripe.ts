import Stripe from "stripe";

const stripeSecretKey = process.env.NODE_ENV === 'production' ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-12-18.acacia',
  });

  export { stripe };
