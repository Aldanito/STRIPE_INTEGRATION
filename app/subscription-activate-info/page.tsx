"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  return (
    <section className="bg-gray-900 dark:bg-gray-900 min-h-screen flex flex-col justify-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          {status === "cancel" ? (
            <>
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-red-500 dark:text-red-500">
                Cancelled
              </h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-200 md:text-4xl dark:text-white">
                Subscription was cancelled.
              </p>
              <Link
                href="https://gaiamine.com"
                className="inline-flex text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-red-900 my-4"
              >
                Return to Main Page
              </Link>
            </>
          ) : (
            <>
              <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-green-500 dark:text-green-500">
                Success
              </h1>
              <p className="mb-4 text-3xl tracking-tight font-bold text-gray-200 md:text-4xl dark:text-white">
                Subscription successfully completed.
              </p>
              <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
                <Link
                  href="https://gaiamine.com"
                  className="inline-flex items-center justify-center text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Return to Main Page
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default function PaymentStatus() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentStatusContent />
    </Suspense>
  );
}
