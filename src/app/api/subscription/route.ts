import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Subscription from "@/models/Subscription";
import { createMilestonPaymentLink } from "@/lib/mileston";

// POST: Create a subscription payment link and redirect the user.
export async function POST(req: Request) {
  try {
    const { userAddress, customerEmail } = await req.json();
    await connectDB();

    const paymentLinkResult = await createMilestonPaymentLink({
      customerEmail: customerEmail || "customer@example.com",
      amount: "10.00",
      description: "Premium Subscription Payment",
    });

    if (!paymentLinkResult || !paymentLinkResult.paymentLink) {
      console.error("Mileston PaymentLink creation failed");
      return NextResponse.json(
        { message: "Failed to create subscription payment link" },
        { status: 500 }
      );
    }

    // Fix the missing slash in the payment link
    const correctedPaymentLink = paymentLinkResult.paymentLink.replace(
      /(payment-link)(\w+-)/,
      "$1/$2"
    );

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    // Save the subscription details (including the corrected Mileston link) to the database.
    const subscription = await Subscription.create({
      userAddress,
      milestonPaymentLink: correctedPaymentLink,
      expiresAt,
      status: "active",
    });

    console.log("Corrected Payment Link:", correctedPaymentLink);
    
    return NextResponse.json(
      {
        message: "Subscription payment link created successfully",
        paymentLink: correctedPaymentLink,
        subscription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Mileston API Error:", error);
    return NextResponse.json(
      { message: "Error creating subscription" },
      { status: 500 }
    );
  }
}

// GET: Retrieve the subscription status for a given userAddress.
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
