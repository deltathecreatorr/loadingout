import axios from "axios";
import "dotenv/config";
import { getAccessToken } from "./getAccessToken";

const url = "https://api.igdb.com/v4/webhooks";

export async function viewWebhooks() {
  // Setting up webhooks connection
  const client_id = process.env.IGDB_CLIENT_ID;

  try {
    const accessToken = await getAccessToken();
    console.log("Access Token:", accessToken);

    const webhookResponse = await axios.get(url, {
      headers: {
        "Client-ID": client_id,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(webhookResponse.data);
    return webhookResponse.data;
  } catch (error: any) {
    console.error("Error setting up webhooks:", error);
    return { error: "Failed to set up webhooks" };
  }
}

viewWebhooks();
