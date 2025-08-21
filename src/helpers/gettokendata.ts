import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Extracts and verifies the JWT from the request cookies.
 * @param request - The incoming NextRequest object.
 * @returns The decoded token data or an error.
 */
export const getTokenData = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decoded;
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw new Error("Failed to authenticate");
  }
};
