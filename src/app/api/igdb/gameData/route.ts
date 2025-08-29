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

    if (query.filters) {
      const validationError = validateFilters(query.filters);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

    if (query.sort) {
      const validationError = validateSortFields(query.sort);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }
    }

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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

function validateFilters(filters: Record<string, any>): string | null {
  const validFields = getGameModelFields();

  for (const field in filters) {
    const baseField = field.replace(/\$.*$/, "");

    if (!validFields.includes(baseField) && !isMongoOperator(field)) {
      return `Invalid filter field: ${field}`;
    }

    if (typeof filters[field] !== "object" && filters[field] === null) {
      return `Invalid filter value for field: ${field}`;
    }
  }

  return null;
}

function validateSortFields(
  sort: Record<string, "asc" | "desc">
): string | null {
  const validFields = getGameModelFields();

  for (const field in sort) {
    if (!validFields.includes(field)) {
      return `Invalid sort field: ${field}`;
    }
  }

  return null;
}

function getGameModelFields(): string[] {
  const schemaPaths = Game.schema.paths;
  return Object.keys(schemaPaths).filter(
    (key) => !key.startsWith("_") && key !== "__v"
  );
}

function isMongoOperator(field: string): boolean {
  const mongoOperators = [
    "$eq",
    "$ne",
    "$gt",
    "$gte",
    "$lt",
    "$lte",
    "$in",
    "$nin",
    "$and",
    "$or",
    "$not",
    "$nor",
    "$exists",
    "$type",
    "$expr",
    "$jsonSchema",
    "$mod",
    "$regex",
    "$text",
    "$where",
    "$geoIntersects",
    "$geoWithin",
    "$near",
    "$nearSphere",
  ];
  return mongoOperators.includes(field);
}
