"use client";

import { useState, useEffect } from "react";
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

export default function WalletConnect() {
  const account = useCurrentAccount();
  const [loading, setLoading] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");

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
    if (!account || subscriptionActive || !customerEmail.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: account.address,
          customerEmail,
        }),
      });

      const data = await res.json();
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      }
    } catch (error) {
      console.error("Subscription error:", error);
    }

    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <ConnectButton />

      <button
        className={`text-indigo-500 font-semibold bg-white border border-indigo-500 px-4 py-2 rounded-md transition ${
          !account || subscriptionActive || loading
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-indigo-500 hover:text-white"
        }`}
        onClick={() => account && setIsModalOpen(true)}
        disabled={!account || subscriptionActive || loading}
      >
        {!account
          ? "Subscribe"
          : subscriptionActive
          ? "Subscribed"
          : loading
          ? "Processing..."
          : "Subscribe"}
      </button>

      {/* Subscription Email Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-indigo-500 mb-4">
              Enter Your Email
            </h2>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your@email.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                onClick={handleSubscribe}
                disabled={!customerEmail.trim()}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
