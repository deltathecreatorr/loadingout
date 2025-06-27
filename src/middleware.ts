import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname; // Get the path from the url request

  // No need for a token
  const ispublic =
    path === "/login" || path === "/register" || path === "/verifyMe/:path*";

  // Get verification token
  const token = request.cookies.get("token")?.value || "";

  // If the path is public
  if (ispublic && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  // If the path is private and there is no token to login
  if (!ispublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/profile/:path*", "/login", "/register", "/verifyMe/:path*"],
};
