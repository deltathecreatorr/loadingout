import { NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connectToDatabase();

//API route to check if the user is verified according to database
export async function GET() {
  //get token from client
  const token = (await cookies()).get("token")?.value || "";
  let isVerified = false;
  try {
    if (token) {
      //verify token using public key
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
