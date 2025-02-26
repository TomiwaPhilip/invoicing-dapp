"use client";

import { useState, useEffect } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function WalletConnect() {
  const account = useCurrentAccount();
  const [loading, setLoading] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);

  useEffect(() => {
    if (!account) return;

    const fetchSubscription = async () => {
      try {
        const res = await fetch(
          `/api/subscription?userAddress=${account.address}`
        );
        const data = await res.json();
        setSubscriptionActive(data.status === "active");
      } catch (error) {
        console.error("Error fetching subscription:", error);
      }
    };

    fetchSubscription();
  }, [account]);

  const handleSubscribe = async () => {
    if (!account || subscriptionActive) return;
    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: account.address }),
      });

      const data = await res.json();
      if (data.milestonPaymentLink) {
        window.location.href = data.milestonPaymentLink; // Redirect to checkout
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center gap-4">
      <ConnectButton />
      <button
        className={`text-indigo-600 disabled:opacity-50 ${
          subscriptionActive ? "cursor-not-allowed text-gray-500" : ""
        }`}
        onClick={handleSubscribe}
        disabled={subscriptionActive || loading}
      >
        {subscriptionActive
          ? "Subscribed"
          : loading
          ? "Processing..."
          : "Subscribe"}
      </button>
    </div>
  );
}
