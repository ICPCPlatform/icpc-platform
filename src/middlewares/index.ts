import { NextRequest, NextResponse } from "next/server";
import * as adminOnly from "./adminOnly";
import * as authOnly from "./authOnly";
import * as training from "./training";
import { NoAction } from "./utils";

export const middlewares = {
  // order is needed
  functions: [
    authOnly.middleware,
    adminOnly.middleware,
    training.middleware,
  ] satisfies ((req: NextRequest) => Promise<NextResponse | [NoAction,NextRequest]>)[],
};
