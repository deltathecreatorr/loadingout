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
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectToDatabase();
    }

    const query: GameQuery = await request.json();
    const games = await Game.find(query.filters || {})
      .sort(query.sort || {})
      .skip(query.skip || 0)
      .limit(query.limit || 20)
      .select(query.projection || {});

    const gameIds = games
      .map((game) => game.id)
      .filter(
        (gameId): gameId is number =>
          typeof gameId === "number" && !isNaN(gameId) && gameId > 0
      );

    let coverImages = [];
    if (gameIds.length > 0) {
      coverImages = await Cover.find({
        game: { $in: gameIds },
      });
    }

    return NextResponse.json({ games: games, covers: coverImages });
  } catch (error: any) {
    console.error("Error fetching game data:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
