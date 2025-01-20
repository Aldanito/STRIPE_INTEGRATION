
export const BASE_URL = process.env.NODE_ENV === "production" ? (process.env.PROD_BASE_URL as string) : (process.env.BASE_URL as string);