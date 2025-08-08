import { NextResponse } from "next/server";
import Game from "@/models/gameModel.js";
import mongoose from "mongoose";
import { connectToDatabase } from "@/dbConfig/dbConfig";

export async function GET() {
  await connectToDatabase();
  try {
    console.log("Fetching 24hr data for popular games...");

    const data = await Game.find().sort({ popularity_value: -1 }).limit(10);
    console.log("Fetched 24hr data:", data);
    await mongoose.connection.close(); // Close the database connection
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    await mongoose.connection.close(); // Ensure the connection is closed on error
    console.error("Error fetching 24hr data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
