"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface Invoice {
  _id: string;
  clientName: string;
  amount: number;
  currency: string;
  status: string;
  milestonPaymentLink?: string;
  createdAt: string;
}

export default function Invoices() {
  const account = useCurrentAccount();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) return;

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/invoices?userAddress=${account.address}`);
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
      setLoading(false);
    };

    fetchInvoices();
  }, [account]);

  if (!account) return <p>Connect your wallet to see invoices.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Your Invoices</h2>
      {loading && <p>Loading invoices...</p>}
      {invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul>
          {invoices.map((invoice) => (
            <li
              key={invoice._id}
              className="border-b py-2 flex justify-between items-center"
            >
              <div>
                <strong>{invoice.clientName}</strong> - {invoice.amount}{" "}
                {invoice.currency} -
                <span
                  className={
                    invoice.status === "paid"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {invoice.status}
                </span>
              </div>
              {invoice.milestonPaymentLink && invoice.status === "pending" && (
                <a
                  href={invoice.milestonPaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Pay Now
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
