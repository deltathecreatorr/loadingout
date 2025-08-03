import axios from "axios";
import Game from "@/models/gameModel.js";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import "dotenv/config";
import mongoose from "mongoose";
import { getAccessToken } from "./getAccessToken";
// Copying all the games form the IGDB database to MongoDB
// Recommended by IGDB to copy the database and then setup webhooks to keep the database updated

connectToDatabase();

const url = "https://api.igdb.com/v4/games";

export async function populateDatabase() {
  const client_id = process.env.IGDB_CLIENT_ID;
  try {
    const accessToken = await getAccessToken();

    let game_counter_id = 0;
    let running = true;
    let gamesProcessed = 0;
    console.log("Starting to fetch games from IGDB...");

    // Fetch games in batches of 500 until no more games are available
    while (running) {
      const query = `fields *; limit 500; sort id asc; where id > ${game_counter_id};`;

      // POST request to IGDB API to fetch games
      const response = await axios.post(url, query, {
        headers: {
          "Client-ID": client_id,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      const games = response.data;

      // Check if there are games to process
      if (games.length === 0) {
        running = false;
      } else {
        // Update maxId for the next batch
        game_counter_id = games[games.length - 1].id;

        // Add each game to the database

        for (const gameData of games) {
          try {
            await Game.updateOne({ id: gameData.id }, gameData, {
              upsert: true,
            });

            gamesProcessed++;
          } catch (error) {
            console.error("Database Update Error:", error);
          }
        }
      }
    }
    if (running === false) {
      console.log(
        `All games processed. Total games added/updated: ${gamesProcessed}`
      );
      await mongoose.connection.close(); // Close the database connection
      return;
    }
  } catch (error: any) {
    console.error("Error fetching game data:", error);
    return { error: "Failed to fetch game data" };
  }
}

populateDatabase();
