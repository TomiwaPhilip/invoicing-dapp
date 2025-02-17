import mongoose, { Schema, models } from "mongoose";

const InvoiceSchema = new Schema(
  {
    userAddress: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USDC" },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    milestonPaymentLink: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Invoice || mongoose.model("Invoice", InvoiceSchema);
