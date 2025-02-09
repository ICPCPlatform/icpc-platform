import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import expectedBody from "./expectedBody";
import { EmailAuth } from "@/lib/db/schema/user/EmailAuth";
import sendEmail from "@/lib/email/sendEmail";

export async function POST(request: NextRequest) {
  try {
    const { success, data: registerData } = expectedBody.safeParse(
      await request.json(),
    );
    if (!success)
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const dbResult = await db
      .select()
      .from(Users)
      .where(
        or(
          eq(Users.username, registerData.username),
          eq(Users.gmail, registerData.gmail),
          eq(Users.cfHandle, registerData.cfHandle),
        ),
      )
      .execute();
    if (dbResult.length > 0)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );

    // check codeforces handle
    const handleRes = await fetch(
      `https://codeforces.com/api/user.info?handles=${registerData.cfHandle}&checkHistoricHandles=false`,
    );

    if (handleRes.status !== 200)
      return NextResponse.json(
        { error: "Invalid Codeforces handle or codefoces error" },
        { status: 400 },
      );

    const { result } = await handleRes.json();
    console.log(result);
    if (!result)
      return NextResponse.json(
        { error: "Invalid Codeforces handle or codefoces error" },
        { status: 400 },
      );

    const { handle } = result[0];

    if (handle.toLowerCase() !== registerData.cfHandle.toLowerCase())
      return NextResponse.json(
        { error: "Invalid Codeforces handle or codefoces error" },
        { status: 400 },
      );

    registerData.password = await bcrypt.hash(registerData.password, 10);

    const randomToken = (Math.random() * 200).toString(36).substring(2, 15);
    const userId = (await db.insert(Users).values(registerData).returning())[0]
      .userId;
    await db
      .insert(EmailAuth)
      .values({
        userId: userId,
        token: randomToken,
      })
      .execute();
    sendEmail({
      to: [registerData.gmail],
      subject: "Verify your email",
      html:
`<h1>Hello ${registerData.username},</h1>

<p>
Thank you for registering with us! To complete your registration and activate your account, please verify your email address by clicking the link below:

https://${process.env.URL}/api/auth/verify?token=${randomToken}

If you didn't create an account with us, please ignore this message.

Best regards,
The Icpc Assiut Team</p>`.toString(),
    });

    return NextResponse.json(
      { message: "registered" },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error registering:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
