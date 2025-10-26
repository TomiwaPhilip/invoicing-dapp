"use client";

import { useEffect, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Subscription({
  onSubscriptionUpdate,
}: {
  onSubscriptionUpdate: (status: boolean) => void;
}) {
  const { publicKey } = useWallet();
  const accountAddress = publicKey?.toString();
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchSubscription = useCallback(async () => {
    if (!accountAddress) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/subscription?userAddress=${accountAddress}`);
      const data = await res.json();
      const isActive = data.status === "active";
      setSubscriptionActive(isActive);
      onSubscriptionUpdate(isActive);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    }
    setLoading(false);
  }, [accountAddress, onSubscriptionUpdate]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  if (!accountAddress)
    return (
      <p className="m-2">Connect your wallet to subscribe and see names in purple.</p>
    );

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
