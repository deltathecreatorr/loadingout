import { NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connectToDatabase();

export async function GET() {
  const token = (await cookies()).get("token")?.value || "";
  let isVerified = false;
  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as {
        isVerified: boolean;
      };
      isVerified = decoded?.isVerified || false;
    }
  } catch (error: any) {
    console.log("Invalid token:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ isVerified });
}
