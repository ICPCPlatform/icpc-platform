/**
 * Training Middleware Module
 * 
 * This module provides middleware functions to handle training-related route protection
 * and permission checks. It ensures that users have the appropriate permissions to access
 * training resources and materials.
 */

import { getUserDataMiddleware } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { extractTrainingId, userTrainingPermissions } from "./utils";
import { TrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { composeMiddlewares, NoAction } from "../utils";

/**
 * Configuration for training route permissions
 * Maps URL patterns to required permissions
 */
const permissionNeedToPath: {
  pathRegex: RegExp;
  permissions: TrainingPermissions[];
}[] = [
  // Match paths like /protected/trainings/123/materials
  {
    pathRegex: /^\/protected\/trainings\/(?<trainingId>\d+)\/.*?$/,
    permissions: ["View:trainee"],
  },
  // Match paths like /protected/trainings/123/staff/materials
  {
    pathRegex:
      /^\/protected\/trainings\/(?<trainingId>\d+)\/staff\/materials\/.*?$/,
    permissions: ["View:material"],
  },
  // Match paths like /protected/trainings/123/staff/materials/edit-materials/456
  {
    pathRegex:
      /^\/protected\/trainings\/(?<trainingId>\d+)\/staff\/materials\/edit-materials\/(?<blockId>\d+)$/,
    permissions: ["Edit:material", "View:material"],
  },
];

/**
 * Main middleware function that composes all training-related middleware functions
 */
export const middleware = composeMiddlewares(
  permissionNeedToPath.map(({ pathRegex, permissions }) =>
    trainingMiddlewareBuilder({ pathRegex, permissions }),
  ),
);

/**
 * Creates a middleware function for checking training permissions
 * 
 * @param pathRegex - Regular expression to match training-related paths
 * @param permissions - Array of required permissions for the matched paths
 * @returns Middleware function that checks user permissions for training routes
 */
function trainingMiddlewareBuilder({
  pathRegex,
  permissions,
}: {
  pathRegex: RegExp;
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
    if (!url.match(pathRegex)) return [NoAction, req];

    const trainingId = extractTrainingId(url)!;
    const user = await getUserDataMiddleware(req);


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
