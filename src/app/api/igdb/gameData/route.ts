import { NextResponse, NextRequest } from "next/server";
import Game from "@/models/gameModel.js";
import Cover from "@/models/coverModel.js";
import mongoose from "mongoose";
import { connectToDatabase } from "@/dbConfig/dbConfig";

interface GameQuery {
  filters?: Record<string, any>;
  sort?: Record<string, "asc" | "desc">;
  limit?: number;
  skip?: number;
  projection?: Record<string, 1>;
}

export async function POST(request: NextRequest) {
  await connectToDatabase();
  try {
    const query: GameQuery = await request.json();
    const games = await Game.find(query.filters || {})
      .sort(query.sort || {})
      .skip(query.skip || 0)
      .limit(query.limit || 20)
      .select(query.projection || {});

    const coverIds = games
      .map((game) => game.cover)
      .filter(
        (coverId): coverId is number =>
          coverId !== undefined && coverId !== null
      );

    const coverImages = await Cover.find({
      id: { $in: coverIds }, // Assuming 'id' is the field name in Cover model
    });

    return NextResponse.json({ games: games, covers: coverImages });
  } catch (error: any) {
    console.error("Error fetching game data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await mongoose.connection.close();
  }
}
