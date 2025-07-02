import { connectToDatabase } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectToDatabase();

//POST request handler for user login
// Expects a JSON body with 'email' and 'password'
// Returns a JSON response with a success message and a token if login is successful
// If login fails, returns an error message with appropriate status code
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (await bcrypt.compare(password, user.password)) {
      //create token

      const tokenData = {
        id: user._id,
        email: user.email,
        username: user.username,
        isVerified: user.isVerified,
        isAdmin: user.isAdmin,
      };

      // Sign the token with a secret key and expiration date
      const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
        expiresIn: "1d",
      });

      const response = NextResponse.json({
        message: "Login successful",
        success: true,
      });

      response.cookies.set("token", token, { httpOnly: true });
      return response;
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
