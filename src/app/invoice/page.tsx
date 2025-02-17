"use client";

import { useState } from "react";
import InvoiceForm from "../components/InvoiceForm";
import InvoiceList from "../components/InvoiceList";
import WalletConnect from "../components/WalletConnect";
import Subscription from "../components/Subscription";

export default function Home() {
  const [refresh, setRefresh] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Your Dashboard
      </h1>

      {/* Wallet Connection */}
      <WalletConnect />

      {/* Subscription Status */}
      <Subscription onSubscriptionUpdate={setIsSubscribed} />

      {/* Invoice Form & List */}
      <div className="mt-10 w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        <InvoiceForm onInvoiceCreated={() => setRefresh(!refresh)} />
        <InvoiceList refresh={!refresh} isSubscribed={isSubscribed} />
      </div>
    </main>
  );
}
