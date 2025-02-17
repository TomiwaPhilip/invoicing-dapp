import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import { PaymentLink } from "mileston-payments";

// POST handler: Create a subscription payment link using Mileston Payments SDK
export async function POST(req: Request) {
  try {
    const { userAddress, customerEmail } = await req.json();
    await connectDB();

    // Initialize Mileston PaymentLink using your API key and Business ID
    const apiKey = process.env.MILESTON_API_KEY || "";
    const businessId = process.env.MILESTON_BUSINESS_ID || "";
    const paymentLinkSDK = new PaymentLink(apiKey, businessId);

    // Create the payment link payload
    const createPaymentPayload = {
      amount: "10.00", // Subscription amount ($10/month)
      description: "Premium Subscription Payment",
      customerEmail: customerEmail || "customer@example.com", // Provide a valid email if available
    };

    // Create the payment link using the SDK
    const paymentLinkResponse = await paymentLinkSDK.create(
      createPaymentPayload
    );

    // Extract the generated payment link
    const paymentLink = paymentLinkResponse.paymentLink;

    // Set subscription expiry (1 month from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Save the subscription in your database
    const subscription = await Subscription.create({
      userAddress,
      milestonPaymentLink: paymentLink,
      expiresAt,
      status: "active",
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Mileston API Error:", error);
    return NextResponse.json(
      { message: "Error creating subscription" },
      { status: 500 }
    );
  }
}

// GET handler: Retrieve the subscription status for a given userAddress
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userAddress = searchParams.get("userAddress");

  if (!userAddress)
    return NextResponse.json(
      { message: "Missing userAddress" },
      { status: 400 }
    );

  await connectDB();
  const subscription = await Subscription.findOne({ userAddress });

  return NextResponse.json(subscription || { status: "none" });
}
