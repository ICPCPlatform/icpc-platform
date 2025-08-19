import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type AuthenticatedUser = {
  id: string;
  email: string;
  username: string;
  role: string;
  emailVerified: boolean;
  twoFactorEnabled?: boolean;
};

/**
 * Authentication middleware using Better Auth
 * Usage:
 * ```
 * async function POST(request: NextRequest, user: AuthenticatedUser) {}
 * export const POST = withAuth(POSTfn);
 * ```
 */
export function withAuth(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Get session from Better Auth
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      const user: AuthenticatedUser = {
        id: session.user.id,
        email: session.user.email,
        username: session.user.name || session.user.email.split('@')[0],
        role: (session.user as Record<string, unknown>).role as string || 'user',
        emailVerified: session.user.emailVerified,
        twoFactorEnabled: (session.user as Record<string, unknown>).twoFactorEnabled as boolean,
      };

      return await handler(request, user);
    } catch (error) {
      console.error("Authentication error:", error);
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}

/**
 * Admin-only authentication middleware
 * Usage:
 * ```
 * async function POST(request: NextRequest, user: AuthenticatedUser) {}
 * export const POST = withAdminAuth(POSTfn);
 * ```
 */
export function withAdminAuth(
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return withAuth(async (request: NextRequest, user: AuthenticatedUser) => {
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }
    return await handler(request, user);
  });
}