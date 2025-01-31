import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { encryptSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const expectBody = z.object({
  username: z.string(),
  password: z.string(),
});
const errorResponse = NextResponse.json(
  { error: "Invalid username or password" },
  { status: 401 },
);
export async function POST(request: NextRequest) {
  try {
    // Extracting credentials from the request body

    const parseResult = expectBody.safeParse(await request.json());
    if (!parseResult.success) return errorResponse;

    const { username, password } = parseResult.data;
    console.log(`${username} is trying to logging`);

    // Querying the database for the user
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.username, username))
      .execute();

    if (users.length === 0) return errorResponse;

    const user = users[0];

    // Verifying the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return errorResponse;

    // Preparing user data for the session
    const userJson = {
      userId: user.userId.toString(),
      username: user.username,
      role: user.role,
    };

    // Encrypting the session data
    const encryptedSessionData = await encryptSession(userJson);
    const cookie = serialize("session", encryptedSessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // One week
      path: "/",
    });

    // Redirecting to the home page
    return NextResponse.json(
      { message: "authenticated" },
      {
        status: 307,
        headers: {
          "Set-Cookie": cookie, // 7d
        },
      },
    );
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ message: "Failed to log in" }, { status: 500 });
  }
}
