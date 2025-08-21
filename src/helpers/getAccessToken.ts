import axios from "axios";
import "dotenv/config";

/**
 * Fetches an access token from the IGDB API.
 * @returns The access token string or an error object.
 */
export async function getAccessToken() {
  const client_id = process.env.IGDB_CLIENT_ID;
  const client_secret = process.env.IGDB_CLIENT_SECRET;

  try {
    const authResponse = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`
    );
    const accessToken = authResponse.data.access_token;
    return accessToken;
  } catch (error: any) {
    console.error("Error during authentication:", error);
    return { error: "Failed to authenticate with IGDB" };
  }
}
