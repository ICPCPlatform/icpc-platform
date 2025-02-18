import { db } from "@/lib/db";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { type userData } from "@/lib/session";
import authOnly from "@/middelwares/authOnly";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { userFullDataValid as userFulldataValidations } from "@/lib/validation/userFulldataValidations";
import { Users } from "@/lib/db/schema/user/Users";

async function POSTfn(request: NextRequest, user: userData) {
  try {
    const { success, data } = userFulldataValidations.safeParse(
      await request.json(),
    );
    if (!success) {
      return new NextResponse(null, { status: 400 });
    }
    const userFullData = await db
      .select()
      .from(UsersFullData)
      .where(eq(UsersFullData.userId, user.userId))
      .execute();
    if (userFullData.length === 0) {
      const userData = (
        await db
          .select({ cfHandle: Users.cfHandle })
          .from(Users)
          .where(eq(Users.userId, user.userId))
          .execute()
      )[0];
      await db
        .insert(UsersFullData)
        .values({
          userId: user.userId,
          cfHandle: userData.cfHandle,
          username: user.username,
        })
        .execute();
    }
    await db
      .update(UsersFullData)
      .set(data)
      .where(eq(UsersFullData.userId, user.userId))
      .execute();
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.error(e);
    return new NextResponse(null, { status: 500 });
  }
}

const POST = authOnly(POSTfn);
export { POST };
