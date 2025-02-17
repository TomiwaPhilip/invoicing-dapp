"use client";

import { useState } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function WalletConnect() {
  const account = useCurrentAccount();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!account) return;
    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: account.address }),
      });

      const data = await res.json();
      if (data.milestonPaymentLink) {
        window.location.href = data.milestonPaymentLink; // Redirect to Mileston checkout
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
        className="text-indigo-600 disabled:opacity-50"
        onClick={handleSubscribe}
        disabled={loading}
      >
        {loading ? "Processing..." : "Subscribe"}
      </button>
    </div>
  );
}
