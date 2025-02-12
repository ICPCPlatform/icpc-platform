import { db } from "@/lib/db";
import { UserFullData } from "@/lib/db/schema/user/UsersFullData";
import { type userData } from "@/lib/session";
import authOnly from "@/middelwares/authOnly";
import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { userFullData as userFulldataValidations } from "@/lib/validation/userFulldataValidations";

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
      .from(UserFullData)
      .where(eq(UserFullData.userId, user.userId))
      .execute();
    if (userFullData.length === 0) {
      await db.insert(UserFullData).values({ userId: user.userId }).execute();
    }
    await db
      .update(UserFullData)
      .set(data)
      .where(eq(UserFullData.userId, user.userId))
      .execute();
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.error(e);
    return new NextResponse(null, { status: 500 });
  }
}

const POST = authOnly(POSTfn);
export { POST };
