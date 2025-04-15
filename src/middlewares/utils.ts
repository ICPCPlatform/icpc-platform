import { NextRequest, NextResponse } from "next/server";

export type NoAction = "NoAction";
export const NoAction: NoAction = "NoAction";

export function composeMiddlewares(
  middlewares: ((
    req: NextRequest,
  ) => Promise<NextResponse | [NoAction, NextRequest]>)[],
): (req: NextRequest) => Promise<NextResponse | [NoAction, NextRequest]> {
  return async function (req: NextRequest) {
    let updatedRequest = req;

    for (const middleware of middlewares) {
      const result = await middleware(updatedRequest);
      if (result instanceof NextResponse) {
        return result;
      }
      if (result[0] !== NoAction) {
        // If the middleware returns a request, update the request
        updatedRequest = result[1];
      }
    }
    return [NoAction, updatedRequest];
  };
}
