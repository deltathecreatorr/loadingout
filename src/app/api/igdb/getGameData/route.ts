import axios from "axios";
import { NextResponse } from "next/server";
import Game from "@/models/gameModel.js";

const url = "https://api.igdb.com/v4/games";

export async function POST() {
  const client_id = process.env.IGDB_CLIENT_ID;
  const client_secret = process.env.IGDB_CLIENT_SECRET;

  try {
    const authResponse = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
    );
    const accessToken = authResponse.data.access_token;

    let allGames: Game[] = [];
    let game_counter_id = 0;
    let running = true;

    while (running) {
      const query = `fields *; limit 500; sort id asc; where id > ${game_counter_id}`;

      const response = await axios.post(url, query, {
        headers: {
          "Client-ID": client_id,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      const games = response.data.map((game: any) => ({
        ...game,
        cover: {
          url: game.cover?.url
            ? `${game.cover.url.replace("t_thumb", "t_1080p")}`
            : null,
        },
      }));

      allGames = allGames.concat(games);

      if (games.length === 0) {
        running = false;
      } else {
        // Update maxId for the next batch
        game_counter_id = games[games.length - 1].id;
      }
    }

    return NextResponse.json({
      allGames,
      accessToken,
      expiresIn: authResponse.data.expires_in,
    });
  } catch (error: any) {
    console.error("IGDB API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message });
  }
}
