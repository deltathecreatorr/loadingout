import { NextResponse, NextRequest } from "next/server";
import Game from "@/models/gameModel.js";
import Cover from "@/models/coverModel.js";
import mongoose from "mongoose";
import { connectToDatabase } from "@/dbConfig/dbConfig";
/**
 * Interface for game query parameters.
 * This interface defines the structure of the query parameters
 * that can be used to filter, sort, and paginate game data.
 * Uses MongoDB query syntax.
 */
interface GameQuery {
  filters?: Record<string, any>;
  sort?: Record<string, "asc" | "desc">;
  limit?: number;
  skip?: number;
  projection?: Record<string, 1>;
}

// Handles getting the game data needed from the database using MongoDB queries.
export async function POST(request: NextRequest) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectToDatabase();
    }

    //use query to find games based on criteria
    const query: GameQuery = await request.json();
    const games = await Game.find(query.filters || {})
      .sort(query.sort || {})
      .skip(query.skip || 0)
      .limit(query.limit || 20)
      .select(query.projection || {});

    //retrieve the game ids from each game
    const gameIds = games
      .map((game) => game.id)
      .filter(
        (gameId): gameId is number =>
          typeof gameId === "number" && !isNaN(gameId) && gameId > 0
      );

    //Find the cover images associated with each game using the game ids from each game
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
