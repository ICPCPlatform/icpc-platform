import { db } from "@/lib/db";
import { ResetPassword } from "@/lib/db/schema/user/ResetPassword";
import { Users } from "@/lib/db/schema/user/Users";
import send from "@/lib/email/sendEmail";
import { DefaultResponse } from "@/lib/types/DefaultResponse";
import { gmail } from "@/lib/validation/util";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validationSchema = z.object({
  gmail,
});
export async function POST(request: NextRequest): Promise<DefaultResponse> {
  try {
    const { success, data } = validationSchema.safeParse(await request.json());
    if (!success) {
      return NextResponse.json({ msg: "Invalid Input" }, { status: 400 });
    }
    const users = await db
      .select({
        gmail: Users.gmail,
        userId: Users.userId,
      })
      .from(Users)
      .where(eq(Users.gmail, data.gmail))
      .execute();

    if (users.length === 0) {
      return NextResponse.json({ err: "Invalid Email" }, { status: 404 });
    }
    const userId = users[0].userId;

    // generate token
    const token = Math.random().toString(36).substring(2, 15);

    // delete old token if exists
    // or stop if the token is recent (5 minutes)
    const oldTokens = await db
      .select({ endAt: ResetPassword.endAt })
      .from(ResetPassword)
      .where(eq(ResetPassword.userId, userId))
      .execute();

    if (oldTokens.length > 0) {
      const endAt = oldTokens[0].endAt ?? new Date();
      const diff = endAt.getTime(); // Difference in milliseconds

      // Subtract 23 hours and 55 minutes
      const adjustedDiff = diff - (23 * 60 * 60 * 1000 + 55 * 60 * 1000);
      if (adjustedDiff > new Date().getTime()) {
        return NextResponse.json({ err: "Recent Email sent" }, { status: 400 });
      }
      await db
        .delete(ResetPassword)
        .where(eq(ResetPassword.userId, userId))
        .execute();
    }

    // insert the token with the user id
    await db.insert(ResetPassword).values({
      userId,
      token,
    });

    // send email
    send({
      to: [data.gmail],
      subject: "Reset Password",
      html: `
        <h1>Reset Password</h1>
        <p>Click the link below to reset your password</p>
        <a href="https://${process.env.URL}/change-password-reset?token=${token}">Reset Password</a>
      `,
    });
    // send email
    return NextResponse.json({ msg: "Email sent" }, { status: 200 });
  } catch (e) {
    console.error("Error in reset-password/route.ts");
    console.error(e);
    return NextResponse.json({ err: "error just happend" }, { status: 500 });
  }
}
