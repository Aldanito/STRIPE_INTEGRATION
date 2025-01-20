"use client";

import { getStripeInvoice } from "@/src/entities/invoice";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { Suspense, useEffect, useState } from "react";

function SubscriptionUpdateInfoPage() {
    const [invoiceId] = useQueryState('invoice')
    const [invoiceData, setInvoiceData] = useState<{ invoiceUrl: string, invoicePdf: string } | null>(null)

    useEffect(() => {
        (async () => {
            if (invoiceId) {
                const { invoicePdf, invoiceUrl } = await getStripeInvoice(invoiceId)
                setInvoiceData({ invoicePdf, invoiceUrl })
                console.log({ invoicePdf, invoiceUrl })
            }
        })()
    }, [invoiceId])

    return (
        <section className="bg-gray-900 dark:bg-gray-900 min-h-screen flex flex-col justify-center">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-green-500 dark:text-green-500">
                        Success
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-200 md:text-4xl dark:text-white">
                        Subscription successfully updated.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                        <Link
                            href="https://gaiamine.com"
                            className="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Return to Main Page
                        </Link>
                        <Link
                            href={invoiceData?.invoiceUrl || ''}
                            className="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 transition duration-300 ease-in-out transform hover:scale-105"
                        >
                            Invoice
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}


export default function SubscriptionUpdateInfo() {
    return (
        <Suspense>
            <SubscriptionUpdateInfoPage />
        </Suspense>
    )
}