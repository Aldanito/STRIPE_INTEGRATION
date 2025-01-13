'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createCheckoutSession } from '../Actions/Stripe';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const prices = [
    {
        title: 'Basic',
        id: 'price_1QgcDOITy1cFUw2ytvsGZsnK',
        price: 29
    },
    {
        title: 'Advanced',
        id: 'price_1QgcE0ITy1cFUw2yoOu4Z423',
        price: 49 
    },
    {
        title: 'Premium',
        id: 'price_1QgcERITy1cFUw2yNArYFZ5p',
        price: 69
    },
]

export default function Payment() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');

    useEffect(() => {
        // Clear email state when the component mounts
        setEmail('');
    }, []);

    const paymentSubscribe = async (priceId: string) => {
        if (!email) {
            toast.error("Please enter your email to enable the subscription button.");
            return;
        }
        const response = await createCheckoutSession({
            userId: 1,
            email: email,
            priceId: priceId,
            subscription: ''
        });
        console.log(response);
        if (response?.url) {
            router.push(response.url);
        } else {
            console.error("Checkout session URL is undefined");
        }
    }

    const emailChange = (event: any) => {
        setEmail(event.target.value);
    }

    return (
        <section className="bg-gray-900 dark:bg-gray-900 min-h-screen flex flex-col justify-center">
            <ToastContainer />
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-200 dark:text-white">Subscribe</h2>
                    <h2 className="mb-5 font-light text-gray-300 sm:text-xl dark:text-gray-400">
                        Welcome to Gaia's subscription plans. Choose the best plan that suits your needs and join us in making sustainable mining a reality. Empower your operations with our innovative solutions and be a part of the change.
                    </h2>                </div>
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                    <input type="email" id="email" placeholder="name@flowbite.com"
                        className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                        onChange={emailChange}
                        value={email}
                    />
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {prices.map((item) => (
                        <div key={item.id} className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-300 bg-gray-800 rounded-lg border border-gray-700 shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-2xl dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
                            <h3 className="mb-4 text-2xl font-semibold">{item.title}</h3>
                            <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">Best option for personal use & for your next project.</p>
                            <div className="flex justify-center items-baseline my-8">
                                <span className="mr-2 text-5xl font-extrabold">${item.price}</span>
                                <span className="text-gray-500 dark:text-gray-400">/month</span>
                            </div>
                            <button 
                                className="inline-flex items-center justify-center text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-green-900 transition duration-300 ease-in-out transform hover:scale-105"
                                onClick={() => paymentSubscribe(item.id)}
                                type='button'
                            >
                                Get started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}