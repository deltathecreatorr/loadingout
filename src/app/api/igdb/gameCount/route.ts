import { NextResponse } from "next/server";
import Game from "@/models/gameModel.js";
import mongoose from "mongoose";
import { connectToDatabase } from "@/dbConfig/dbConfig";

export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectToDatabase();
    }

    const gameCount = await Game.countDocuments();

    return NextResponse.json({ gameCount });
  } catch (error: any) {
    console.error("Error fetching game count:", error);
    return NextResponse.json(
      { error: "Failed to fetch game count" },
      { status: 500 }
    );
  }
}
