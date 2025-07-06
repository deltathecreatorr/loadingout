import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { getTokenData } from "@/helpers/gettokendata";

connectToDatabase();

//API request to get user information, by searching for unique user id
export async function GET(request: NextRequest) {
  try {
    const userid = await getTokenData(request);

    const user = await User.findOne({ _id: userid }).select("-password");

    return NextResponse.json({
      Message: "User found",
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
