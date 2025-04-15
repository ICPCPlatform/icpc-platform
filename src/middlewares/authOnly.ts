import { type NextRequest, NextResponse } from "next/server";
import { decryptSession } from "@/lib/session";
import { NoAction } from "./utils";

/**
 * middleware to check if the user logged
 * this middleware add x-user header to the request
 * __containg the user data__ if the user is logged in
 */
export async function middleware(
  req: NextRequest,
): Promise<[NoAction, NextRequest] | NextResponse> {
  const url = req.nextUrl.pathname;
  const session = req.cookies.get("session")?.value;
  if (url.startsWith("/protected")) {
    const validation = await decryptSession(session);
    if (!validation) {
      // is not logged in
      return NextResponse.redirect(new URL("/login", req.url));
    }
    req.headers.append(
      "x-user",
      JSON.stringify({
        username: validation.username,
        role: validation.role,
        userId: validation.userId,
      }),
    );
  }
  return [NoAction, req];
}
