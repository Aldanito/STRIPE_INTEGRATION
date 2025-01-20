'use server'

import { connectDatabase } from "@/src/shared/database/gaiaHubConnect";

export const getUserById = async (userId: string): Promise<{ userId: string; customerId: string, email: string }> => {
    const pool = connectDatabase()
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
              SELECT id, stripe_id, email
              FROM users
              WHERE id = '${userId}';
          `);
        const res = {
            userId: rows[0].id,
            customerId: rows[0].stripe_id,
            email: rows[0].email
        } as const
        return (res)
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.release();
        pool.end();
    }
}

export const editUser = async ({ email, customerId }: { email: string, customerId: string, }): Promise<void> => {
    const pool = connectDatabase()
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
        pool.end();
    }
};