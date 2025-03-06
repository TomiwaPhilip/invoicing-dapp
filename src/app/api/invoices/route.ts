import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/models/Invoice";
import { createMilestonInvoice } from "@/lib/mileston";

/**
 * Helper function to generate the Mileston invoice link.
 */
async function generateMilestonInvoice(body: {
  clientEmail: string;
  amount: number;
}): Promise<string | null> {
  try {
    const result = await createMilestonInvoice({
      clientEmail: body.clientEmail,
      amount: body.amount,
    });
    if (result && result.invoiceLink) {
      return result.invoiceLink;
    }
    return null;
  } catch (error) {
    console.error("Error generating Mileston invoice:", error);
    return null;
  }
}

/**
 * Helper function to save invoice details to the database.
 */
async function saveInvoiceToDB(
  body: {
    userAddress: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    currency: string;
  },
  invoiceLink: string
) {
  try {
    const newInvoice = await Invoice.create({
      userAddress: body.userAddress,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      amount: body.amount,
      currency: body.currency,
      milestonPaymentLink: invoiceLink,
      status: "pending",
      createdAt: new Date(),
    });
    return newInvoice;
  } catch (error) {
    console.error("Error saving invoice to DB:", error);
    throw error;
  }
}

// GET: Fetch invoices for a user
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userAddress = searchParams.get("userAddress");

    if (!userAddress) {
      console.error("Missing userAddress in query params");
      return NextResponse.json(
        { message: "Missing userAddress" },
        { status: 400 }
      );
    }

    console.log("Fetching invoices for user");
    const invoices = await Invoice.find({ userAddress }).sort({
      createdAt: -1,
    });
    return NextResponse.json(invoices, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching invoices:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error fetching invoices", error: errorMessage },
      { status: 500 }
    );
  }
}

// POST: Create a new invoice
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userAddress, clientName, amount, currency, clientEmail } = body;
    if (!userAddress || !clientName || !amount || !currency || !clientEmail) {
      console.error("Invalid request data:", body);
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    console.log("Processing invoice creation for", clientEmail);

    // Generate the Mileston invoice link.
    const invoiceLink = await generateMilestonInvoice({
      clientEmail,
      amount,
    });

    if (!invoiceLink) {
      console.error("Failed to generate Mileston invoice link");
      return NextResponse.json(
        { message: "Failed to generate invoice link" },
        { status: 500 }
      );
    }

    // Save the invoice details (including the Mileston link) to the database.
    const newInvoice = await saveInvoiceToDB(
      { userAddress, clientName, clientEmail, amount, currency },
      invoiceLink
    );
    console.log("Invoice saved to DB");

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating invoice:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Error creating invoice", error: errorMessage },
      { status: 500 }
    );
  }
}
