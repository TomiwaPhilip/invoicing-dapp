"use client";

import { useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Invoice as MilestonInvoice } from "mileston-payments";

interface InvoiceData {
  _id: string;
  clientName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  invoiceLink?: string;
}

export default function InvoiceList({
  refresh,
  isSubscribed,
}: {
  refresh: boolean;
  isSubscribed: boolean;
}) {
  const account = useCurrentAccount();
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [milestonApiKey] = useState(
    process.env.NEXT_PUBLIC_MILESTON_API_KEY || ""
  );
  const [businessId] = useState(
    process.env.NEXT_PUBLIC_MILESTON_BUSINESS_ID || ""
  );

  useEffect(() => {
    if (!account) return;

    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/invoices?userAddress=${account.address}`);
        const data: InvoiceData[] = await res.json();

        if (milestonApiKey && businessId) {
          const invoiceApi = new MilestonInvoice(milestonApiKey, businessId);
          const updatedInvoices = await Promise.all(
            data.map(async (invoice) => {
              if (invoice.invoiceLink) {
                try {
                  const response = await invoiceApi.get(invoice.invoiceLink);

                  console.log("Mileston Invoice Response ok");

                  // Ensure response contains 'status'
                  if (
                    response &&
                    typeof response === "object" &&
                    "status" in response &&
                    typeof response.status === "string"
                  ) {
                    return {
                      ...invoice,
                      status: response.status,
                    };
                  } else {
                    console.warn("Unexpected response format:", response);
                  }
                } catch (error) {
                  console.error(
                    "Error fetching Mileston invoice status:",
                    error
                  );
                }
              }
              return invoice;
            })
          );
          setInvoices(updatedInvoices);
        } else {
          setInvoices(data);
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
      setLoading(false);
    };

    fetchInvoices();
  }, [account, refresh, milestonApiKey, businessId]);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900">Your Invoices</h2>
      {loading && <p>Loading invoices...</p>}
      {!loading && invoices.length === 0 ? (
        <p>No invoices found.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {invoices.map((invoice) => (
            <li key={invoice._id} className="border p-4 rounded-lg shadow-md">
              <p
                className={`font-semibold ${
                  isSubscribed ? "text-purple-600" : "text-gray-900"
                }`}
              >
                {invoice.clientName}
              </p>
              <p>
                {invoice.amount} {invoice.currency}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(invoice.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
