import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const client_id = process.env.IGDB_CLIENT_ID;
  const client_secret = process.env.IGDB_CLIENT_SECRET;

  try {
    const { query } = await req.json();

    const authResponse = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
    );
    const accessToken = authResponse.data.access_token;

    const response = await axios.post("https://api.igdb.com/v4/games", query, {
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

    return NextResponse.json({
      games,
      accessToken,
      expiresIn: authResponse.data.expires_in,
    });
  } catch (error: any) {
    console.error("IGDB API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: error.message });
  }
}
