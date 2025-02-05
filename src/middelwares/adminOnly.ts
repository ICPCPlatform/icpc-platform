import { NextResponse, NextRequest } from "next/server";
import { decryptSession, type userData } from "@/lib/session";

/**
 * this is a clouser function that takes a function as an argument and returns a function
 * How to use 
 * `
 * async function POST(request: NextRequest, user: userData) {}
 * module.exports = { POST: adminOnly(POST) };
 * `
 */
export default function adminOnly(
  f: (request: NextRequest, user: userData) => Promise<NextResponse>,
) {
  return async (request: NextRequest) => {
    const session = request.cookies.get("session")?.value;
    const user = (await decryptSession(session)) as userData;
    if (user.role === "admin") {
      return await f(request, user);
    }
    return new NextResponse(null, { status: 401 });
  };
}
