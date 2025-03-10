import { db } from "@/lib/db";
import { EmailAuth } from "@/lib/db/schema/user/EmailAuth";
import { Users } from "@/lib/db/schema/user/Users";
import { eq } from "drizzle-orm";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const res = await db
    .delete(EmailAuth)
    .where(eq(EmailAuth.token, request.nextUrl.searchParams.get("token") ?? ""))
    .returning();
  if (res.length === 0) return redirect("/login");
  const user = res[0];
  const { username } = (
    await db
      .select({ username: Users.username })
      .from(Users)
      .where(eq(Users.userId, user.userId))
      .execute()
  )[0];
  return redirect(`/login?username=${encodeURIComponent(username)}`);
}
