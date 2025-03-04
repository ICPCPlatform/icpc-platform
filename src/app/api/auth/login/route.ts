import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";
import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { encryptSession } from "@/lib/session";
import { eq, or, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { userLoginValid } from "@/lib/validation/userLogin";
import { passwordMustMatch } from "@/lib/const/error-messages";
import { type DefaultResponse } from "@/lib/types/DefaultResponse";

export async function POST(request: NextRequest) : Promise<DefaultResponse> {
  try {
    // Extracting credentials from the request body

    const parseResult = userLoginValid.safeParse(await request.json());
    if (!parseResult.success) {
      return NextResponse.json(
        { err: parseResult.error?.errors.map((e) => e.message)[0] },
        { status: 400 },
      );
    }

    const { usernameOrGmail, password } = parseResult.data;
    console.log(`${usernameOrGmail} is trying to logging`);

    // Querying the database for the user
    const users = await db
      .select({
        userId: Users.userId,
        username: Users.username,
        role: Users.role,
        password: Users.password,
      })
      .from(Users)
      .where(
        and(
          or(
            eq(Users.username, usernameOrGmail),
            eq(Users.gmail, usernameOrGmail),
          ),
        ),
      )
      .execute();

    if (users.length === 0)
      return NextResponse.json({ err: "User not found" }, { status: 404 });

    const user = users[0];

    // Verifying the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return NextResponse.json(
      { err: passwordMustMatch },
      { status: 401 },
    );

    // Preparing user data for the session
    const userJson = {
      userId: user.userId,
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
      { msg: "authenticated" },
      {
        status: 307,
        headers: {
          "Set-Cookie": cookie, // 7d
        },
      },
    );
  } catch (error) {
    console.error("Error logging in:", error);
    return NextResponse.json({ err: "Failed to log in" }, { status: 500 });
  }
}
