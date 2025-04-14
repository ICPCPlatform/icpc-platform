import type { NextResponse } from "next/server";

/**
 * A default response type for API routes.
 */
type DefaultResponse = NextResponse<{ msg: string } | { err: string }>;
