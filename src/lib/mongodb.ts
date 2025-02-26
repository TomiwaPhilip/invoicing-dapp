import mongoose, { Connection } from "mongoose";

const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Correctly type the cached object
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<typeof mongoose> | null;
}

// Use a globally cached connection to prevent multiple connections in dev mode
const cached: MongooseCache = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, {
      dbName: "invoicing-dapp",
      bufferCommands: false,
    });
  }

  cached.conn = (await cached.promise).connection; // Extracting `connection`
  return cached.conn;
}
