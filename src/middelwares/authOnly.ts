import { type NextRequest, NextResponse } from "next/server";
import { decryptSession } from "@/lib/session";

/**
 * middleware to check if the user logged
 * this middleware add x-user header to the request
 * __containg the user data__ if the user is logged in
 */
export async function middleware(
  req: NextRequest,
): Promise<null | NextResponse> {
  const url = req.nextUrl.pathname;
  if (url.startsWith("/protected")) {
    const session = req.cookies.get("session")?.value;
    const validation = await decryptSession(session);
    if (!validation) {
      // is not logged in
      return NextResponse.redirect(new URL("/login", req.url));
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
