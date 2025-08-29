import axios from "axios";
import "dotenv/config";
import { getAccessToken } from "../getAccessToken";
/**
 * Deletes a webhook by its ID.
 * @returns The response from the IGDB API or an error message.
 */
export async function deleteWebhook() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const prompt = require("prompt-sync")();
  const webhookId = prompt("Enter the webhook ID to delete:");
  const url = `https://api.igdb.com/v4/webhooks/${webhookId}`;
  const client_id = process.env.IGDB_CLIENT_ID;
  const accessToken = await getAccessToken();

  try {
    const response = await axios.delete(url, {
      headers: {
        "Client-ID": client_id,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("Webhook deleted successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting webhook:", error);
    return { error: "Failed to delete webhook" };
  }
}

deleteWebhook();
