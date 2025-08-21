import axios from "axios";
import "dotenv/config";
import { getAccessToken } from "../getAccessToken";

/**
 * Represents the type of entity for webhook connections, either games or covers.
 */
type EntityType = "games" | "covers";

/**
 * Connects webhooks for a specific entity type in the IGDB API.
 * @param entity - The entity type (games or covers) to connect webhooks for.
 * @returns An array of responses from the IGDB API or an error message.
 */
export async function connectWebhooks(entity: EntityType) {
  const url = `https://api.igdb.com/v4/${entity}/webhooks`;
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

connectWebhooks("games");
connectWebhooks("covers");
