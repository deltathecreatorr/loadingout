import { NextResponse } from "next/server";
import User from "@/models/userModel";
import mongoose from "mongoose";
import { connectToDatabase } from "@/dbConfig/dbConfig";

export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectToDatabase();
    }

    const userCount = await User.countDocuments();

    return NextResponse.json({ userCount });
  } catch (error: any) {
    console.error("Error fetching user count:", error);
    return NextResponse.json(
      { error: "Failed to fetch user count" },
      { status: 500 }
    );
  }
}
