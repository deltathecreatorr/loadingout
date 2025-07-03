import mongoose from "mongoose";

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDB connected");
    });

    connection.on("error", (err: any) => {
      console.log("MongoDB connection error:", err);
    });
  } catch (error: any) {
    console.log("MongoDB connection error:", error);
    throw new Error(
      "Failed to connect to the database. Please check your MONGODB_URL and network access."
    );
  }
}
