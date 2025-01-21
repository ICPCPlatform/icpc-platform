import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { encryptSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // Extracting credentials from the request body
    const { username, password } = await request.json();
    console.log(`Attempting login for username: ${username}`);

    // Querying the database for the user
    const users = await db
      .select()
      .from(Users)
      .where(eq(Users.username, username))
      .execute();

    if (users.length === 0) {
      // Invalid username or password
      return new Response("Invalid username or password", { status: 401 });
    }

    const user = users[0];

    // Verifying the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response("Invalid username or password", { status: 401 });
    }

    // Preparing user data for the session
    const userJson = {
      userId: user.userId.toString(),
      username: user.username,
      role: user.role,
    };

    // Encrypting the session data
    const session = await encryptSession(userJson);

    // Setting the session cookie
    const cookieStore = cookies();
    const sessionExpiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(sessionExpiresAt),
      sameSite: "lax",
      path: "/",
    });

    // Redirecting to the home page
    return Response.redirect("/");

  } catch (error) {
    console.error("Error logging in:", error);
    return new Response("Failed to log in", { status: 500 });
  }
}
