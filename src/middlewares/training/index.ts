/**
 * Training Middleware Module
 *
 * This module provides middleware functions to handle training-related route protection
 * and permission checks. It ensures that users have the appropriate permissions to access
 * training resources and materials.
 */

import { getUserData } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { userTrainingPermissions } from "./utils";
import { TrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { composeMiddlewares, NoAction } from "../utils";
import UrlPattern from "url-pattern";
import { z } from "zod";

/**
 * Configuration for training route permissions
 * Maps URL patterns to required permissions
 */
const permissionNeedToPath: {
  urlPath: UrlPattern;
  permissions: TrainingPermissions[];
}[] = [
  // Match paths like /protected/trainings/123/materials
  {
    urlPath: new UrlPattern("/protected/trainings/:trainingId(/:tail*)"),
    permissions: ["View:trainee"],
  },
  // Match paths like /protected/trainings/123/staff/materials
  {
    urlPath: new UrlPattern("/protected/trainings/:trainingId/staff/materials"),
    permissions: ["View:material"],
  },
  // Match paths like /protected/trainings/123/staff/materials/edit-materials/456
  {
    urlPath: new UrlPattern(
      "/protected/trainings/:trainingId/staff/materials/edit-materials/:materialId",
    ),
    permissions: ["Edit:material", "View:material"],
  },
  // Match paths like /protected/trainings/123/staff/materials
  {
    urlPath: new UrlPattern("/protected/trainings/:trainingId/staff/materials"),
    permissions: ["View:material"],
  },
  // Match paths like /protected/trainings/123/staff/contests
  {
    urlPath: new UrlPattern("/protected/trainings/:trainingId/staff/contests"),
    permissions: ["View:contest"],
  },
  // Match paths like /protected/trainings/123/staff/contests/edit-contest
  {
    urlPath: new UrlPattern(
      "/protected/trainings/:trainingId/staff/contests/:contestId/edit-contest",
    ),
    permissions: ["Edit:contest", "View:contest"],
  },
  // Match paths like /protected/trainings/123/staff/edit-blocks
  {
    urlPath: new UrlPattern(
      "/protected/trainings/:trainingId/staff/edit-blocks",
    ),
    permissions: ["Edit:block", "View:block"],
  },
  // Match paths like /protected/trainings/123/staff/edit-blocks/456
  {
    urlPath: new UrlPattern(
      "/protected/trainings/:trainingId/staff/edit-blocks/:blockId",
    ),
    permissions: ["Edit:block", "View:block"],
  },
  {
    urlPath: new UrlPattern(
      "/protected/trainings/:trainingId/staff/edit-standing-view",
    ),
    permissions: ["Edit:training"],
  },
  {
    urlPath: new UrlPattern(
      "/protected/trainings/:trainingId/staff/edit-training",
    ),
    permissions: ["Edit:training"],
  },
  {
    urlPath: new UrlPattern(
      "/protected/trainings/:trainingId/staff/staff-management(/:tail*)",
    ),
    permissions: ["View:staff"],
  },
  {
    urlPath: new UrlPattern(
      "/protected/trainings/:trainingId/staff/assign-mentor(/:tail*)",
    ),
    permissions: ["View:staff"],
  },
];

/**
 * Main middleware function that composes all training-related middleware functions
 */
export const middleware = composeMiddlewares(
  permissionNeedToPath.map(({ urlPath, permissions }) =>
    trainingMiddlewareBuilder({ urlPath, permissions }),
  ),
);

/**
 * Creates a middleware function for checking training permissions
 *
 * @param urlPath - URL pattern to match training paths
 * @param permissions - Array of required permissions for the matched paths
 * @returns Middleware function that checks user permissions for training routes
 */
function trainingMiddlewareBuilder({
  urlPath,
  permissions,
}: {
  urlPath: UrlPattern;
  permissions: TrainingPermissions[];
}) {
  // Create a copy of permissions to prevent mutation
  const permissionsCopy = [...permissions];

  return async function viewTrainingMiddleware(
    req: NextRequest,
  ): Promise<NextResponse | [NoAction, NextRequest]> {
    const permissions = permissionsCopy;
    const url = req.nextUrl.pathname;

    // Skip if URL doesn't match the pattern
    const match = urlPath.match(url);
    if (!match) return [NoAction, req];
    const trainingIdRaw = Number(match.trainingId);
    let trainingId;
    if (
      !isNaN(trainingIdRaw) &&
      z.number().int().safeParse(trainingIdRaw).success
    ) {
      trainingId = trainingIdRaw;
    } else {
      return new NextResponse("/404", { status: 404 });
    }

    const user = await getUserData();

    // Handle authentication
    if (!user) {
      // User not logged in, redirect to login
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Get user permissions for the training
    const userPermissions = new Set(
      await userTrainingPermissions({
        trainingId,
        userId: user.userId,
      }),
    );

    // Check if user has all required permissions
    if (permissions.every((val) => userPermissions.has(val))) {
      // User has access, continue
      return [NoAction, req];
    } else {
      // User doesn't have access, redirect to not found
      return NextResponse.redirect(new URL("/not-found", req.url));
    }
  };
}
