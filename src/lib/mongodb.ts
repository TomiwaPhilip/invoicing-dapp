import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

const globalWithMongoose = global as unknown as { mongoose?: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } };

const cached = globalWithMongoose.mongoose || { conn: null, promise: null };

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
globalWithMongoose.mongoose = cached;
