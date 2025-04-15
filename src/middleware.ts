import { NextRequest, NextResponse } from "next/server";

import { middlewares } from "./middlewares/index";
import { composeMiddlewares } from "./middlewares/utils";

export default async function middleware(
  req: NextRequest,
): Promise<NextResponse> {
  // check if x-user header is present
  // if present, refuse the request
  if (req.headers.has("x-user")) {
    // this prevent security issues stop
    return new NextResponse(null, { status: 403 });
  }

  const composedMiddleware = composeMiddlewares(middlewares.functions);
  const response = await composedMiddleware(req);
  if (response instanceof NextResponse) {
    return response;
  }
  return NextResponse.next({ request: req });
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
