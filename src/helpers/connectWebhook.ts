import axios from "axios";
import "dotenv/config";
import { getAccessToken } from "./getAccessToken";

const url = "https://api.igdb.com/v4/games/webhooks";

export async function connectWebhooks() {
  // Setting up webhooks connection
  const client_id = process.env.IGDB_CLIENT_ID;
  const host_url = process.env.HOST_URL;

  try {
    const accessToken = await getAccessToken();

    const headers = {
      "Client-ID": client_id,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const webhookMethods = [
      { method: "create", path: "/api/igdb/createWebhook" },
      { method: "update", path: "/api/igdb/updateWebhook" },
      { method: "delete", path: "/api/igdb/deleteWebhook" },
    ];

    const responses = await Promise.all(
      webhookMethods.map(async ({ method, path }) => {
        const params = new URLSearchParams();
        params.append("url", `${host_url}${path}`);
        params.append("secret", process.env.WEBHOOK_SECRET!);
        params.append("method", method);

        const response = await axios.post(url, params, { headers });

        return response;
      })
    );

    console.log(responses);
    return responses;
  } catch (error: any) {
    console.error("Error setting up webhooks:", error);
    return { error: "Failed to set up webhooks" };
  }
}

connectWebhooks();
