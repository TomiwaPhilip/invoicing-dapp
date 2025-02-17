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

      {/* Invoice Section */}
      <div className="mt-10 w-full max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* Invoice Form */}
        <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6 max-h-[400px] overflow-y-auto">
          <InvoiceForm onInvoiceCreated={() => setRefresh(!refresh)} />
        </div>

        {/* Invoice List */}
        <div className="w-full lg:w-1/2 bg-white shadow-md rounded-lg p-6 max-h-[400px] overflow-y-auto">
          <InvoiceList refresh={!refresh} isSubscribed={isSubscribed} />
        </div>
      </div>
    </main>
  );
}
