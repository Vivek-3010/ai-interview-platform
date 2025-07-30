import mongoose from "mongoose";

let isConnected = false; // global cache (for hot reloads)

const connectMongoDB = async () => {
  if (isConnected) {
    console.log("✅ Already connected to MongoDB");
    return true;
  }

  try {
    const db = await mongoose.connect(process.env.NEXT_MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Connected to MongoDB");
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default connectMongoDB;
