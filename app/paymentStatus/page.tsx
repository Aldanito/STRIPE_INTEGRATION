'use client'
import { createPortalSession, getCustomer } from '@/components/Actions/Stripe';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// export const getCustomer = async ({ sessionId }: { sessionId: string }) => {
//     const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
//     return checkoutSession
// }

// export const createPortalSession = async ({ customerId }: { customerId: string }) => {
//     const returnUrl = 'http://localhost:3000';

//     const portalSession = await stripe.billingPortal.sessions.create({
//         customer: customerId,
//         return_url: returnUrl,
//     });

//     return portalSession
// };


export default function PaymentStatus() {
    const searchParams = useSearchParams()
    const [portalUrl, setPortalUrl] = useState<string>('')

    useEffect(() => {
        (async () => {
            try {
                const session = searchParams.get('session_id')
                if (!session) return
                const customer = await getCustomer({ sessionId: session })
                const result = await createPortalSession({ customerId: customer.customer as string })
                setPortalUrl(result.url)
                console.log(result)
            } catch (error) {
            }
        })()

    }, [searchParams])
    return (
        <section className="bg-gray-900 dark:bg-gray-900 min-h-screen flex flex-col justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-green-500 dark:text-green-500">Success</h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-200 md:text-4xl dark:text-white">Subscription successfully completed.</p>
                    <a href={portalUrl} target='_blank' className="inline-flex text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-green-900 my-4">Manage subscription</a>
                </div>
            </div>
        </section>
    )
} 