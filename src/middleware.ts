import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const ispublic =
    path === "/login" || path === "/register" || path === "/verifyMe/:path*";

  const token = request.cookies.get("token")?.value || "";

  if (ispublic && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!ispublic && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/profile/:path*", "/login", "/register", "/verifyMe/:path*"],
};
