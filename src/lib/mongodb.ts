import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Correct the cached type to match mongoose instance
let cached: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } =
  (global as any).mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "invoicing-dapp",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
