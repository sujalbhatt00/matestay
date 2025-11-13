import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error("❌ MONGODB_URI is not defined in .env file");
      process.exit(1);
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("📍 Connection string:", uri.replace(/:[^:]*@/, ':****@')); // Hide password in logs

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);

    // Monitor connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Failed:");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    process.exit(1);
  }
};

export default connectDB;