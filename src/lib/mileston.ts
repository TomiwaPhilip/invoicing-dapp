import { Invoice } from "mileston-payments";

const apiKey: string = process.env.MILESTON_API_KEY ?? "";
const businessId: string = process.env.MILESTON_BUSINESS_ID ?? "semilogopaul";
const businessName: string =
  process.env.MILESTON_BUSINESS_NAME ?? "semilogopaul";

if (!apiKey || !businessId) {
  throw new Error(
    "Mileston API credentials are missing in environment variables."
  );
}

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
