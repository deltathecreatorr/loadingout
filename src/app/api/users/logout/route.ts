import { NextResponse } from "next/server";

//API request ot logout, wipe client cookie
export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });
    // Clear token cookie by setting it as empty
    response.cookies.set("token", "", { httpOnly: true });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
