import { NextResponse } from "next/server";
import { middleware } from "../middleware";
import type { NextRequest } from "next/server";

const mockNextRequest = (url: string, token?: string): NextRequest => {
  const fullUrl = new URL(url, "http://localhost:3000");
  // Creating a mock NextRequest
  return {
    nextUrl: {
      pathname: fullUrl.pathname,
      searchParams: new URLSearchParams(),
      toString: () => fullUrl.toString(),
      clone: () => ({ ...fullUrl }),
    },
    cookies: {
      get: (name: string) =>
        name === "token" && token ? { value: token } : undefined,
      getAll: () => [],
      has: () => false,
      set: () => {},
      delete: () => {},
    },
    url: fullUrl.toString(),
    headers: new Headers(),
    geo: null,
    ip: "",
    method: "GET",
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(""),
  } as unknown as NextRequest;
};

describe("middleware", () => {
  // Test for public paths
  // Routes that anyone can access without authentication
  describe("public paths", () => {
    const publicPaths = ["/login", "/register", "/verifyMe/:path*"];

    publicPaths.forEach((path) => {
      it(`should redirect to home if user has token and tries to access ${path}`, () => {
        const request = mockNextRequest(path, "valid-token");
        const response = middleware(request);

        expect(response).toEqual(
          NextResponse.redirect(new URL("/", request.url))
        );
      });

      it(`should allow access to ${path} if user has no token`, () => {
        const request = mockNextRequest(path);
        const response = middleware(request);

        expect(response).toBeUndefined();
      });
    });
  });

  // Test for private paths
  // Routes that require authentication
  describe("private paths", () => {
    const privatePaths = ["/", "/profile"];

    privatePaths.forEach((path) => {
      it("should redirect to login if no auth for private path " + path, () => {
        const request = mockNextRequest(path);
        const response = middleware(request);
        expect(response).toEqual(
          NextResponse.redirect(new URL("/login", request.url))
        );
      });

      it("should allow access if auth" + path, () => {
        const request = mockNextRequest(path, "mockToken");
        const response = middleware(request);
        expect(response).toBeUndefined();
      });
    });
  });

  // Test for edge cases and erroneous paths
  describe("edge cases", () => {
    it("should handle empty paths", () => {
      const request = mockNextRequest("");
      const response = middleware(request);
      expect(response).toEqual(
        NextResponse.redirect(new URL("/login", request.url))
      );
    });

    it("should handle undefined token", () => {
      const request = mockNextRequest("/profile", "");
      const response = middleware(request);
      expect(response).toEqual(
        NextResponse.redirect(new URL("/login", request.url))
      );
    });
  });
});
