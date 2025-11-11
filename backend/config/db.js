// ...existing code...
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const uri =
  process.env.MONGODB_URI || process.env.MONGO_URI || process.env.DATABASE_URL;

// debug: log loaded env keys (do not commit secrets)
console.log("DEBUG env keys:", {
  MONGODB_URI_exists: !!process.env.MONGODB_URI,
  MONGO_URI_exists: !!process.env.MONGO_URI,
  DATABASE_URL_exists: !!process.env.DATABASE_URL,
  CLIENT_URL: process.env.CLIENT_URL,
});

if (!uri) {
  console.error("Missing MongoDB URI. Add MONGODB_URI to backend/.env");
  process.exit(1);
}

const connectWithRetry = async (maxRetries = 5, initialDelayMs = 2000) => {
  let attempt = 0;
  let delay = initialDelayMs;

  const opts = {
    // increase timeouts for flaky networks; adjust if needed
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    // tls options are managed by Atlas by default
  };

  while (attempt < maxRetries) {
    try {
      console.log(`Attempting MongoDB connection (attempt ${attempt + 1}/${maxRetries})...`);
      const conn = await mongoose.connect(uri, opts);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.error(`MongoDB connect attempt ${attempt + 1} failed:`, err && err.message);
      attempt += 1;
      if (attempt >= maxRetries) break;
      console.log(`Retrying in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }

  console.error("MongoDB connection failed after retries. See logs above.");
  throw new Error("MongoDB connection failed");
};

export default connectWithRetry;
// ...existing code...