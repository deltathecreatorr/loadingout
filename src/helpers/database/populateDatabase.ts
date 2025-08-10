import axios from "axios";
import Game from "@/models/gameModel.js";
import Cover from "@/models/coverModel.js";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import "dotenv/config";
import mongoose, { Model, AnyBulkWriteOperation } from "mongoose";
import { getAccessToken } from "../getAccessToken";
// Copying all the games form the IGDB database to MongoDB
// Recommended by IGDB to copy the database and then setup webhooks to keep the database updated

const url = "https://api.igdb.com/v4/";

type EntityType = "games" | "covers";

export async function populateDatabase(entity: EntityType) {
  const client_id = process.env.IGDB_CLIENT_ID;

  const Model: Model<any> = entity === "games" ? Game : Cover;

  try {
    const accessToken = await getAccessToken();

    let last_record_id = 0;
    let recordsProcessed = 0;
    console.log(`Starting to fetch ${entity} from IGDB...`);

    // Fetch games in batches of 500 until no more games are available
    while (true) {
      const query = `fields *; limit 500; sort id asc; where id > ${last_record_id};`;

      // POST request to IGDB API to fetch games
      const response = await axios.post(`${url}${entity}`, query, {
        headers: {
          "Client-ID": client_id,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      });

      const records = response.data;

      // Check if there are games to process
      if (records.length === 0) {
        break;
      } else {
        // Update maxId for the next batch
        last_record_id = records[records.length - 1].id;

        // Add each game to the database

        const bulkWrites: AnyBulkWriteOperation<any>[] = records.map(
          (record: any) => ({
            updateOne: {
              filter: { id: record.id },
              update: { $set: record },
              upsert: true,
            },
          })
        );

        await Model.bulkWrite(bulkWrites);
        recordsProcessed += records.length;
        console.log(
          `Processed ${records.length} ${entity}. Total: ${recordsProcessed}`
        );
      }
    }
  } catch (error: any) {
    console.error("Error fetching game data:", error);
    return { error: "Failed to fetch game data" };
  }
}

async function main() {
  try {
    await connectToDatabase();
    await Promise.all([populateDatabase("covers"), populateDatabase("games")]);
  } catch (error: any) {
    console.error("Error in main function:", error);
    return { error: "Failed to execute main function" };
  } finally {
    await mongoose.connection.close();
  }
}

main();
