import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.WEBHOOK_SECRET;

  try {
    const requestBody = await request.json();
    const signature = request.headers.get("X-IGDB-Signature");
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
