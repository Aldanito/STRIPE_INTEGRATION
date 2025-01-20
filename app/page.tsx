import { SubscriptionPlan } from "@/src/widgets/SubscriptionPlan/ui/SubscriptionPlan";
import { Suspense } from "react";

function HomePage() {

  return (
    <div>
      <SubscriptionPlan />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}

