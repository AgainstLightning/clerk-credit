import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined");
  }

  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGODB_URL, {
        dbName: "clerk-credit",
        bufferCommands: false,
      });

    cached.conn = await cached.promise;

    return cached.conn;
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error("Error details:", error);
    console.error(
      "Connection string (redacted):",
      MONGODB_URL.replace(/\/\/[^@]*@/, "//****:****@")
    );
    throw error;
  }
};
