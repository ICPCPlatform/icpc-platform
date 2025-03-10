import type { NextResponse } from "next/server";

type DefaultResponse = NextResponse<{ msg: string } | { err: string }>;
