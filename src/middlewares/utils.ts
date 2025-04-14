import { NextRequest, NextResponse } from "next/server";

export type NoAction = "NoAction";
export const NoAction: NoAction = "NoAction";

export function composeMiddlewares(
  middlewares: ((req: NextRequest) => Promise<NextResponse | typeof NoAction>)[]
) {
  return async (req: NextRequest) => {
    for (const middleware of middlewares) {
      const result = await middleware(req);
      if (result !== NoAction) return result;
    }
    return NoAction;
  };
}