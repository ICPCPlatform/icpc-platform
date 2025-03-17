import { NextRequest, NextResponse } from "next/server";

import { middlewares } from "./middelwares/index";

export default async function middleware(
  req: NextRequest,
): Promise<NextResponse> {
  for (let i = 0; i < middlewares.functions.length; i++) {
    const response = await middlewares.functions[i](req);
    if (response) {
      return response;
    }
  }
  return NextResponse.next({request:req});
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
  runtime: "nodejs",
};
