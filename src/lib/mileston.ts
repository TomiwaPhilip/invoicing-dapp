import { Invoice, PaymentLink } from "mileston-payments";

const apiKey: string = process.env.MILESTON_API_KEY ?? "";
const businessId: string = process.env.MILESTON_BUSINESS_ID ?? "";
const businessName: string = process.env.MILESTON_BUSINESS_NAME ?? "";

if (!apiKey || !businessId) {
  throw new Error(
    "Mileston API credentials are missing in environment variables."
  );
}

/**
 * Creates an invoice and returns its invoice link.
 */
export async function createMilestonInvoice({
  clientEmail,
  amount,
}: {
  clientEmail: string;
  amount: number;
}): Promise<{ invoiceLink: string } | null> {
  try {
    console.log("Creating Mileston invoice");

    const formattedAmount = parseFloat(amount.toString()).toFixed(2);
    console.log("Api Key:", apiKey);
    console.log("Business ID:", businessId);
    console.log("Business Name:", businessName);
    console.log("Client Email:", clientEmail);
    console.log("Amount:", formattedAmount);

    const invoiceSDK = new Invoice(apiKey, businessId);
    const response = await invoiceSDK.create(businessName, {
      amount: formattedAmount,
      itemName: "Service Invoice",
      customerEmail: clientEmail,
      dueDate: new Date(),
    });

    console.log("Mileston API Full Response ok");

    if (!response || !response.invoiceLink) {
      console.error("Mileston response is missing an invoice link.");
      throw new Error("Mileston response is missing an invoice link.");
    }

    return { invoiceLink: response.invoiceLink };
  } catch (error) {
    console.error("Mileston API Error:", error);
    return null;
  }
}

/**
 * Creates a subscription payment link and returns it.
 */
export async function createMilestonPaymentLink({
  customerEmail,
  amount,
  description,
}: {
  customerEmail: string;
  amount: string;
  description: string;
}): Promise<{ paymentLink: string } | null> {
  try {
    console.log("Creating Mileston payment link");

    const paymentLinkSDK = new PaymentLink(apiKey, businessId);
    const payload = {
      amount,
      description,
      customerEmail,
    };

    const response = await paymentLinkSDK.create(payload);

    if (!response || !response.paymentLink) {
      console.error("Mileston response is missing a payment link.");
      throw new Error("Mileston response is missing a payment link.");
    }

    return { paymentLink: response.paymentLink };
  } catch (error) {
    console.error("Mileston PaymentLink API Error:", error);
    return null;
  }
}
