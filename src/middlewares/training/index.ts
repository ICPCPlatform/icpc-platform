import { decryptSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { extractTrainingId, userTrainingPermissions } from "./utils";
import { TrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { composeMiddlewares, NoAction } from "../utils";


const permissionNeedToPath: {
  pathRegex: RegExp,
  permissions: TrainingPermissions[];
}[] = [
    // Match paths like /protected/trainings/123/materials
    {
      pathRegex: /^\/protected\/trainings\/(?<trainingId>\d+)\/materials\/?$/,
      permissions: [
        "View:material"
      ]
    },
    // Match paths like /protected/trainings/123/contest/standing
    {
      pathRegex: /^\/protected\/trainings\/(?<trainingId>\d+)\/contests\/(?<contestId>\d+)\/standing\/?$/,
      permissions: [
        "View:standing"
      ]
    }
  ]

export const middleware = composeMiddlewares(permissionNeedToPath.map(
({ pathRegex, permissions }) => trainingMiddlewareBuilder({ pathRegex, permissions })
))






function trainingMiddlewareBuilder({ pathRegex, permissions }: { pathRegex: RegExp, permissions: TrainingPermissions[] }) {
  return async function viewTrainingMiddleware(req: NextRequest): Promise<NextResponse | NoAction> {
    const url = req.nextUrl.pathname;
    if (!url.match(pathRegex))
      return NoAction;

    const trainingId = extractTrainingId(url);

    const session = req.cookies.get("session")?.value;
    const validation = await decryptSession(session);

    if (trainingId === null) {
      return NoAction;
    }

    // Handle authentication
    if (!validation) {
      // User not logged in, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userPermissions = new Set(... await userTrainingPermissions({
      trainingId,
      userId: validation.userId
    }));

    // Extract training ID from URL if it's a training path
    // Not a training URL, pass through



    if (permissions.every(userPermissions.has)) {
      // User has access, continue
      return NoAction;
    } else {
      // User doesn't have access
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  }
}