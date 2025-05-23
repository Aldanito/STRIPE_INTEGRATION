"use client";

import { createCheckoutSession } from "@/src/entities/checkout";
import {
  getStripeSubscription,
  getStripeSubscriptionByEmail,
  removeStripeSubscription,
  updateStripeSubscription,
} from "@/src/entities/subscription";
import { getUserById } from "@/src/entities/user";
import { useModal } from "@/src/shared/hooks/useModal";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Stripe from "stripe";
import { UpdateSubscriptionModal } from "../../UpdateSubscriptionModal";
import { RemoveSubscriptionModal } from "../../RemoveSubscriptionModal";
import { planList } from "../config";
import { updateSubscriptionEndsAt } from "@/src/entities/user";

type Subscription = Stripe.Subscription & { plan: Stripe.Plan };

type SelectedPlan = {
  priceId: string;
  title: string;
  price: number;
  endDate: string;
};

export const SubscriptionPlan = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string>("");
  const [currentPlan, setCurrentPlan] = useState<null | string>(null);
  const [currentPlanInterval, setCurrentPlanInterval] = useState<null | string>(
    null
  );
  const searchParams = useSearchParams();
  const { open: updateOpen, toggle: toggleUpdate } = useModal();
  const { open: removeOpen, toggle: toggleRemove } = useModal();
  const [selectedPlan, setSelectedPlan] = useState<null | SelectedPlan>(null);
  const [init, setInit] = useState<boolean>(true);

  const paymentSubscribe = async (priceId: string) => {
    setLoading(priceId);
    try {
      const response = await createCheckoutSession({
        priceId: priceId,
        userId: userId,
      });
      if (response?.url) {
        router.push(response.url);
      } else {
        console.error("Checkout session URL is undefined");
      }

      const customer = await getUserById(userId);
      const subscription = await getStripeSubscriptionByEmail(
        customer?.email || ""
      );

      const subscriptionEndDate = subscription?.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;

      await updateSubscriptionEndsAt({
        email: customer?.email || "",
        subscriptionEndsAt: subscriptionEndDate,
      });
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.warn("Network error occurred, but redirecting anyway.");
      } else {
        toast.error("User with the provided email not found.");
        console.error(error);
      }
    } finally {
      setLoading(null);
    }
  };

  const selectUpdatedPlan = (plan: {
    priceId: string;
    title: string;
    price: number;
  }) => {
    toggleUpdate();
    setSelectedPlan({
      ...plan,
      endDate: new Date().toISOString().split("T")[0],
    });
  };

  const selectCancelledPlan = (plan: {
    priceId: string;
    title: string;
    price: number;
  }) => {
    toggleRemove();
    setSelectedPlan({
      ...plan,
      endDate: new Date().toISOString().split("T")[0],
    });
  };

  const cancelUpdatedPlan = () => {
    toggleUpdate();
    setSelectedPlan(null);
  };

  const cancelRemovePlan = () => {
    toggleRemove();
    setSelectedPlan(null);
  };

  const updateSubscription = async () => {
    if (selectedPlan) {
      const result = await updateStripeSubscription({
        customerId,
        priceId: selectedPlan.priceId,
      });
      router.push(`/subscription-update-info?invoice=${result.invoiceId}`);
    }
  };

  const cancelSubscription = async () => {
    if (currentPlan) {
      try {
        await removeStripeSubscription(customerId);
        setCurrentPlan(null);
        router.push(`/subsciption-cancelation-info`);
      } catch (error) {
        toast.error("Error canceling subscription.");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      const userId = searchParams.get("user_id") || "";
      if (!userId) {
        window.location.href = "https://gaiamine.com/login?redirect=checkout";
        return;
      }

      const user = await getUserById(userId);
      if (!user) {
        window.location.href = "https://gaiamine.com/login?redirect=checkout";
        return;
      }

      setUserId(user.userId);
      setCustomerId(user.customerId);

      if (user.customerId) {
        const subscription = (await getStripeSubscription({
          customerId: user.customerId,
        })) as Subscription;
        if (
          subscription &&
          subscription.plan &&
          subscription.status === "active"
        ) {
          setCurrentPlan(subscription.plan.id);
          setCurrentPlanInterval(subscription.plan.interval);
        }
      }
      setInit(false);
    })();
  }, [searchParams]);

  return (
    <>
      <section className="bg-gray-900 dark:bg-gray-900 min-h-screen flex flex-col justify-center">
        <ToastContainer />
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-200 dark:text-white">
              Subscribe
            </h2>
            <h2 className="mb-5 font-light text-gray-300 sm:text-xl dark:text-gray-400">
              Join the Mines Matter movement and bridge the energy metals’ gap
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-8 w-full">
            {planList.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between h-full p-6 max-w-lg text-center text-gray-300 bg-gray-800 rounded-lg border border-gray-700 shadow-lg transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <h3 className="mb-4 text-2xl font-semibold">{item.title}</h3>
                <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                  {item.description}
                </p>
                <div className="flex justify-center items-baseline my-8">
                  <span className="mr-2 text-5xl font-extrabold">
                    HK${item.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    /{item.title === "Yearly" ? "year" : "month"}
                  </span>
                </div>
                {item.title === "Yearly" && (
                  <p className="text-green-500 font-semibold">
                    Save 16% compared to monthly plan!
                  </p>
                )}
                <div className="mt-auto">
                  <button
                    className={`
inline-flex items-center justify-center w-full
${
  item.id === currentPlan
    ? "bg-gradient-to-r from-[#870E0E] to-[#CC1100] hover:opacity-90"
    : item.title === "Monthly" && currentPlanInterval === "year"
    ? "bg-gray-500 cursor-not-allowed"
    : "bg-gradient-to-r from-[#1B3385] to-[#25C5C9] hover:opacity-90"
}
text-white 
focus:ring-4 focus:outline-none focus:ring-green-300 
font-medium rounded-lg text-sm px-5 py-2.5 text-center 
transition duration-300
  `}
                    onClick={() =>
                      item.id === currentPlan
                        ? selectCancelledPlan({
                            priceId: item.id,
                            price: item.price,
                            title: item.title,
                          })
                        : currentPlan
                        ? selectUpdatedPlan({
                            priceId: item.id,
                            price: item.price,
                            title: item.title,
                          })
                        : paymentSubscribe(item.id)
                    }
                    type="button"
                    disabled={
                      loading === item.id ||
                      init ||
                      (item.title === "Monthly" &&
                        currentPlanInterval === "year")
                    }
                  >
                    {loading === item.id || init ? (
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
                    ) : item.id === currentPlan ? (
                      "Cancel current subscription"
                    ) : item.title === "Monthly" &&
                      currentPlanInterval === "year" ? (
                      "Unavailable"
                    ) : currentPlan === null ? (
                      "Get started"
                    ) : (
                      "Update plan"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <RemoveSubscriptionModal
        open={removeOpen}
        toggle={toggleRemove}
        onCancel={cancelRemovePlan}
        removeSubscription={cancelSubscription}
        plan={selectedPlan}
      />
      <UpdateSubscriptionModal
        plan={selectedPlan}
        open={updateOpen}
        toggle={cancelUpdatedPlan}
        onOk={updateSubscription}
        onCancel={cancelUpdatedPlan}
      />
    </>
  );
};
