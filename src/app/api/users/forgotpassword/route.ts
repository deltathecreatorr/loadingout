import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/helpers/mailer";

connectToDatabase();
//API route to search for email in database and send mail if user has forgotten password
export async function POST(request: NextRequest) {
  try {
    //request recieved would be JSON body of email from the forgotpassword page.tsx
    const reqBody = await request.json();
    const { email } = reqBody;
    console.log(email);
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await sendMail({ email: user.email, emailType: "RESET", userId: user._id });

    return NextResponse.json({
      message: "Reset Link Send successfully",
      success: true,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
