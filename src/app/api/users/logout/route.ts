import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      Message: "Logout successful",
      success: true,
    });
    // Clear token cookie by setting it as empty
    response.cookies.set("token", "", { httpOnly: true });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
