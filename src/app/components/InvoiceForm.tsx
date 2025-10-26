"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

export default function InvoiceForm({
  onInvoiceCreated,
}: {
  onInvoiceCreated: () => void;
}) {
  const { publicKey, connected } = useWallet();
  const accountAddress = publicKey?.toString();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDC");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !accountAddress) {
      alert("Connect your wallet first!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: accountAddress,
          clientName,
          clientEmail,
          amount,
          currency,
        }),
      });

      const data = await response.json();
      console.log("API Response ok");

      if (!response.ok) {
        throw new Error(data.message || "Failed to create invoice");
      }

      setClientName("");
      setClientEmail("");
      setAmount("");
      setCurrency("USDC");
      // Notify the user of success
      alert("Invoice created successfully. Your client will receive an email shortly.");
      onInvoiceCreated();
    } catch (error: unknown) {
      console.error("Error creating invoice:", error);
      alert(
        error instanceof Error
          ? `Error: ${error.message}`
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Create Invoice</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Client Name
        </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Client Email
        </label>
        <input
          type="email"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Currency
          </label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="USDC">USDC</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg shadow-md hover:bg-indigo-500 transition duration-200"
      >
        {loading ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  );
}
