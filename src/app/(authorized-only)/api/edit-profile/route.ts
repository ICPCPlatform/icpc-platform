import { db } from "@/lib/db";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { withAuth, type AuthenticatedUser } from "@/lib/auth-middleware";
import { rateLimit } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { userFullData as userFulldataValidations } from "@/lib/validation/userFulldataValidations";
import { Users } from "@/lib/db/schema/user/Users";

async function POSTfn(request: NextRequest, user: AuthenticatedUser) {
  try {
    const { success, data } = userFulldataValidations.safeParse(
      await request.json(),
    );
    if (!success) {
      return new NextResponse(null, { status: 400 });
    }
    const userId = parseInt(user.id);
    const userFullData = await db
      .select()
      .from(UsersFullData)
      .where(eq(UsersFullData.userId, userId))
      .execute();
    if (userFullData.length === 0) {
      const userData = (
        await db
          .select({ cfHandle: Users.cfHandle })
          .from(Users)
          .where(eq(Users.userId, userId))
          .execute()
      )[0];
      await db
        .insert(UsersFullData)
        .values({
          userId: userId,
          cfHandle: userData.cfHandle,
          username: user.username,
        })
        .execute();
    }
    await db
      .update(UsersFullData)
      .set(data)
      .where(eq(UsersFullData.userId, userId))
      .execute();
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.error(e);
    return new NextResponse(null, { status: 500 });
  }
}

// Apply rate limiting and auth
const POST = rateLimit({ maxRequests: 10, windowMs: 60000 })(
  withAuth(POSTfn)
);

export { POST };
