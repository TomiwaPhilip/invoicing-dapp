import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function GET() {
  await connectDB();
  const invoices = await Invoice.find();
  return NextResponse.json(invoices);
}
