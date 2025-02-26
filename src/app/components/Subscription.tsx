"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function Subscription({
  onSubscriptionUpdate,
}: {
  onSubscriptionUpdate: (status: boolean) => void;
}) {
  const account = useCurrentAccount();
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;

    const fetchSubscription = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/subscription?userAddress=${account.address}`
        );
        const data = await res.json();
        const isActive = data.status === "active";
        setSubscriptionActive(isActive);
        onSubscriptionUpdate(isActive);
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
      setLoading(false);
    };

    fetchSubscription();
  }, [account]);

  if (!account)
    return <p className="m-2">Connect your wallet to subscribe and see names in purple.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg m-6">
      <h2 className="text-xl font-semibold mb-4">Premium Subscription</h2>
      {loading ? (
        <p>Loading...</p>
      ) : subscriptionActive ? (
        <p className="text-green-600">✅ Subscription Active</p>
      ) : (
        <p className="text-red-600">❌ No Active Subscription</p>
      )}
    </div>
  );
}
