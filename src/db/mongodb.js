import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Cache the connection across hot-reloads in dev and across serverless
 * invocations in production, so we don't open a new connection per request.
 */
let cached = globalThis._mongoose;
if (!cached) {
  cached = globalThis._mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your .env file (see .env.example)."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        // Fail fast instead of hanging if the cluster is unreachable.
        serverSelectionTimeoutMS: 8000,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // Reset so the next request can retry instead of reusing a broken promise.
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}
