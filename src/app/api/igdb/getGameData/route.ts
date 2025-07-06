import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  const clientID = process.env.IGDB_CLIENT_ID;
  const accessToken = process.env.IGDB_CLIENT_SECRET;

  try {
    if (!clientID || !accessToken) {
      return NextResponse.json(
        { error: "IGDB credentials missing" },
        { status: 500 }
      );
    }

    const query =
      "fields name, cover.url; limit 20; sort popularity desc; where total_rating_count > 100 & cover.url != null;";

    const response = await axios.post("https://api.igdb.com/v4/games", query, {
      headers: {
        Accept: "application/json",
        "Client-ID": clientID,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.response?.status || 500 }
    );
  }
}
