import axios from "axios";
import Game from "@/models/gameModel.js";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import "dotenv/config";
import mongoose from "mongoose";
import { getAccessToken } from "./getAccessToken";
// Copying all the games form the IGDB database to MongoDB
// Recommended by IGDB to copy the database and then setup webhooks to keep the database updated

connectToDatabase();

const url = "https://api.igdb.com/v4/popularity_primitives";

export async function getPopScore() {
  const client_id = process.env.IGDB_CLIENT_ID;
  try {
    const accessToken = await getAccessToken();

    console.log("Starting to update popularity scores from IGDB...");

    // Fetch games in batches of 500 until no more games are available
    const query = `fields game_id,value,popularity_type; limit 10; sort value desc; where popularity_type = 5;`;

    // POST request to IGDB API to fetch games
    const response = await axios.post(url, query, {
      headers: {
        "Client-ID": client_id,
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const games = response.data;

    for (const game of games) {
      const { game_id, value } = game;
      await Game.updateOne(
        { id: game_id },
        { $set: { popularity_score: value } },
        { upsert: true }
      );
    }
    console.log("Fetched popularity scores:", games);
    await mongoose.connection.close(); // Close the database connection
    return;
  } catch (error: any) {
    console.error("Error fetching game data:", error);
    return { error: "Failed to fetch game data" };
  }
}

getPopScore();
