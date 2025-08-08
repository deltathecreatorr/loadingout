import { NextResponse } from "next/server";
import Game from "@/models/gameModel.js";
import { connectToDatabase } from "@/dbConfig/dbConfig";

export async function POST(request: Request) {
  await connectToDatabase();

  try {
    const requestBody = await request.json();
    if (request.headers.get("x-secret") == process.env.WEBHOOK_SECRET) {
      console.log("Creating game document in the database");
      await Game.updateOne({ id: requestBody.id }, requestBody, {
        upsert: true,
      });
      return NextResponse.json(
        { message: "Webhook processed successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid webhook secret" },
        { status: 403 }
      );
    }
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
