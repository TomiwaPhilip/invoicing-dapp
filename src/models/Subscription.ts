import mongoose, { Schema, models } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    userAddress: { type: String, required: true, unique: true },
    status: { type: String, enum: ["active", "expired"], default: "active" },
    milestonPaymentLink: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default models.Subscription ||
  mongoose.model("Subscription", SubscriptionSchema);
