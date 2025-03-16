import { NextRequest, NextResponse } from "next/server";
import { decryptSession } from "@/lib/session";

/**
 * middleware to check if the user is admin and logged
 * this middleware add x-user header to the request
 * __containg the user data__ if the user is logged in
 */
export async function middleware(
  req: NextRequest,
): Promise<null | NextResponse> {
  const url = req.nextUrl.pathname;
  if (url.startsWith("/admin-only")) {
    const session = req.cookies.get("session")?.value;
    const validation = await decryptSession(session);
    if (!validation || validation.role !== "admin") {
      // is not logged in or not an admin
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
    req.headers.set(
      "x-user",
      JSON.stringify({
        username: validation.username,
        role: validation.role,
        userId: validation.userId,
      }),
    );
  }
  return null;
}

/*
 * `neededPaths` is an array of strings that are
 * the paths that the middleware will be applied to
 * you need to insure that the path is correct
 * and used above
 */
