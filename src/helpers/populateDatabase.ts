import axios from "axios";
import { NextResponse } from "next/server";
import Game from "@/models/gameModel.js";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import "dotenv/config";

connectToDatabase();

const url = "https://api.igdb.com/v4/games";

export async function populateDatabase() {
  const client_id = process.env.IGDB_CLIENT_ID;
  const client_secret = process.env.IGDB_CLIENT_SECRET;

  try {
    const authResponse = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
    );
    console.log("Authentication successful, fetching games...");
    const accessToken = authResponse.data.access_token;

    let game_counter_id = 0;
    let running = true;
    let gamesProcessed = 0;
    console.log("Starting to fetch games from IGDB...");

    // Fetch games in batches of 500 until no more games are available
    while (running) {
      const query = `fields age_ratings,aggregated_rating,aggregated_rating_count,alternative_names,artworks,bundles,category,checksum,collection,collections,cover,created_at,dlcs,expanded_games,expansions,external_games,first_release_date,follows,forks,franchise,franchises,game_engines,game_localizations,game_modes,game_status,game_type,genres,hypes,involved_companies,keywords,language_supports,multiplayer_modes,name,parent_game,platforms,player_perspectives,ports,rating,rating_count,release_dates,remakes,remasters,screenshots,similar_games,slug,standalone_expansions,status,storyline,summary,tags,themes,total_rating,total_rating_count,updated_at,url,version_parent,version_title,videos,websites; limit 25; sort id asc; where id > ${game_counter_id}`;

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
    return NextResponse.json({
      message: `The amount of games processed is ${gamesProcessed}`,
    });
  } catch (error: any) {
    console.error("Error fetching game data:", error);
    return NextResponse.json({ error: "Failed to fetch game data" });
  }
}

populateDatabase();
