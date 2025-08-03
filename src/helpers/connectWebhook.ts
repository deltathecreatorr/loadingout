import axios from "axios";
import "dotenv/config";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import { getAccessToken } from "./getAccessToken";

connectToDatabase();

const url = "https://api.igdb.com/v4/games/webhooks";

export async function connectWebhooks() {
  // Setting up webhooks connection
  const client_id = process.env.IGDB_CLIENT_ID;
  const host_url = process.env.HOST_URL;

  try {
    const accessToken = await getAccessToken();

    const params = new URLSearchParams();
    params.append("url", `${host_url}/games`);
    params.append("secret", process.env.WEBHOOK_SECRET!);
    params.append("method", "create");

    const webhookResponse = await axios.post(url, params, {
      headers: {
        "Client-ID": client_id,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log(webhookResponse.data);
    return webhookResponse.data;
  } catch (error: any) {
    console.error("Error setting up webhooks:", error);
    return { error: "Failed to set up webhooks" };
  }
}

connectWebhooks();
