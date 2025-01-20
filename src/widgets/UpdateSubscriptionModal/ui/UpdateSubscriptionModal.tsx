
type Props = {
    open: boolean,
    toggle: () => void,
    onOk: () => void,
    onCancel: () => void
    plan: { priceId: string, title: string, price: number } | null
}

export const UpdateSubscriptionModal = ({ open, toggle, onOk, onCancel, plan }: Props) => {

    // const closeModal = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //     event.stopPropagation()
    //     toggle()
    // }

    return (
        <>
            <div className={`${open ? "flex bg-gray-900/50" : "hidden"} 
                overflow-y-auto overflow-x-hidden fixed top-0 
                right-0 left-0 z-50 justify-center items-center 
                w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`} >
                <div className="relative p-4 w-full max-w-2xl max-h-full">

                    <div className="relative bg-gray-700 rounded-lg shadow dark:bg-gray-700">

                        <div className="flex items-center justify-between p-4 md:p-5 rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-300 dark:text-gray-500">
                                Confirm Subscription Plan Change
                            </h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-300 
                                            hover:text-gray-600 rounded-lg text-sm w-8 h-8 
                                            ms-auto inline-flex justify-center items-center 
                                            dark:hover:bg-gray-600 dark:hover:text-white"
                                onClick={toggle}
                            >
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Upgrade plan</span>
                            </button>
                        </div>

                        <div className="p-4 md:p-5 space-y-4">
                            <p className="text-base leading-relaxed text-gray-300 dark:text-gray-400">You are about to switch your subscription plan.</p>
                            <div className="mt-3">
                                <div className="flex justify-between mt-2">
                                    <span className="font-medium text-gray-300">New Plan:</span>
                                    <span className="text-gray-300">{`${plan?.title} ($${plan?.price})`}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-4">
                                The changes will take effect immediately, and your billing will be updated accordingly.
                            </p>
                        </div>

                        <div className="flex items-center p-4 md:p-5 rounded-b dark:border-gray-600">
                            <button type="button"
                                className="text-white bg-green-600 hover:bg-green-800 
                                        focus:ring-4 focus:outline-none focus:ring-green-300 
                                        font-medium rounded-lg text-sm px-5 py-2.5 text-center
                                        transition duration-300 ease-in-out"
                                onClick={onOk}>
                                Confirm
                            </button>
                            <button
                                type="button"
                                className="bg-gray-600 hover:bg-gray-900 py-2.5 px-5 ms-3 text-sm font-medium 
                                            text-gray-300 focus:outline-none rounded-lg border border-gray-400  
                                            focus:z-10 focus:ring-4 focus:ring-gray-100 
                                            transition duration-300 ease-in-out"
                                onClick={onCancel}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}