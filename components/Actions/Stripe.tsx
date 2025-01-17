'use server'
import Stripe from 'stripe';
import mariadb from 'mariadb'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2024-12-18.acacia',
});

const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.PROD_BASE_URL as string : process.env.BASE_URL as string;

const pool = mariadb.createPool({
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

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

export const createCheckoutSession = async ({ priceId, subscription, userId }: { priceId: string, subscription: string, userId: string }) => {
    try {
        if (!userId) {
            throw new Error('User ID not found in URL');
        }

        const email = await getUserEmailById(userId);
        const customers = await stripe.customers.list({ email });
        let customerId: string;

        if (customers.data.length > 0) {
            customerId = customers.data[0].id;
        } else {
            const customerParams: Stripe.CustomerCreateParams = {
                email,
                // metadata: { userId: userId.toString() },
            };

            const newCustomer = await stripe.customers.create(customerParams);
            customerId = newCustomer.id;
        }

        await addCustomerToBase({ customerId, email });

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            line_items: [{ price: priceId, quantity: 1 }],
            metadata: { subscription },
            mode: "subscription",
            success_url: `${BASE_URL}/paymentStatus?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${BASE_URL}/paymentStatus?status=cancel`,
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

export const addCustomerToBase = async ({ customerId, email }: { customerId: string, email: string }) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`
            UPDATE users
            SET stripe_id = '${customerId}'
            WHERE email = '${email}';
        `);
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.release(); 
    }
}

export const getUserEmailById = async (userId: string) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(`
              SELECT email
              FROM users
              WHERE id = '${userId}';
          `);
      if (rows.length > 0) {
        console.log(rows[0].email);
        return rows[0].email;
      } else {
        throw new Error(`User with ID ${userId} not found`);
      }
    } catch (err) {
      throw err;
    } finally {
        if (conn) await conn.release();
    }
  };