import { db } from "@/lib/db";
import { ResetPassword } from "@/lib/db/schema/user/ResetPassword";
import { Users } from "@/lib/db/schema/user/Users";
import send from "@/lib/email/sendEmail";
import { gmail } from "@/lib/validation/util";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const validationSchema = z.object({
  gmail,
});
export async function POST(request: NextRequest) {
  try {
    const { success, data } = validationSchema.safeParse(await request.json());
    if (!success) {
      return new NextResponse("Invalid Email", { status: 400 });
    }
    const users = await db
      .select({
        gmail: Users.gmail,
      })
      .from(Users)
      .where(eq(Users.gmail, data.gmail))
      .execute();
    if (users.length === 0) {
      return new NextResponse("Invalid Email", { status: 404 });
    }
    // generate token
    const token = Math.random().toString(36).substring(2, 15);
    // save token
    const [{ userId }] = await db
      .select({ userId: Users.userId })
      .from(Users)
      .where(eq(Users.gmail, data.gmail))
      .execute();

    await db.insert(ResetPassword).values({
      userId,
      token,
    });
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
    return new NextResponse("Email sent", { status: 200 });
  } catch (e) {
    console.error("Error in reset-password/route.ts");
    console.error(e);
    return new NextResponse(null, { status: 500 });
  }
}
