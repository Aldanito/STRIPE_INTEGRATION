import { useState } from "react";

type Props = {
  open: boolean;
  toggle: () => void;
  removeSubscription: () => Promise<void>;
  onCancel: () => void;
  plan: {
    priceId: string;
    title: string;
    price: number;
    endDate: string;
  } | null;
};

export const RemoveSubscriptionModal = ({
  open,
  toggle,
  removeSubscription,
  onCancel,
  plan,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const handleRemoveSubscription = async () => {
    setLoading(true);
    try {
      await removeSubscription();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`${open ? "flex bg-gray-900/70" : "hidden"} 
                  overflow-y-auto overflow-x-hidden fixed top-0 
                  right-0 left-0 z-50 justify-center items-center 
                  w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-gray-800 rounded-lg shadow-lg dark:bg-gray-800">
            <div className="flex items-center justify-between p-4 md:p-5 rounded-t border-b border-gray-700">
              <h3 className="text-xl font-semibold text-gray-100 dark:text-gray-100">
                Confirm Subscription Plan Cancel
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-300 
                                              hover:text-gray-600 rounded-lg text-sm w-8 h-8 
                                              ms-auto inline-flex justify-center items-center 
                                              dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={toggle}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-300 dark:text-gray-400">
                You are about to cancel your subscription plan.
              </p>
              {plan && (
                <div className="mt-3">
                  <div className="flex justify-between mt-2">
                    <span className="font-medium text-gray-300">
                      Current Plan:
                    </span>
                    <span className="text-gray-300">{`${plan.title} (HK$${plan.price})`}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-medium text-gray-300">
                      Cancelation Date:
                    </span>
                    <span className="text-gray-300">{plan.endDate}</span>
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-300 mt-4">
                The changes will take effect immediately, and your billing will
                be updated accordingly.
              </p>
            </div>

            <div className="flex justify-between items-center p-4 md:p-5 rounded-b border-t border-gray-700">
              <button
                type="button"
                className="bg-gray-600 hover:bg-gray-900 py-2.5 px-5 ms-3 text-sm font-medium 
                                              text-gray-300 focus:outline-none rounded-lg border border-gray-400  
                                              focus:z-10 focus:ring-4 focus:ring-gray-100 
                                              transition duration-300 ease-in-out"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="text-white bg-green-600 hover:bg-green-800 
                                          focus:ring-4 focus:outline-none focus:ring-green-300 
                                          font-medium rounded-lg text-sm px-5 py-2.5 text-center
                                          transition duration-300 ease-in-out"
                onClick={handleRemoveSubscription}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
