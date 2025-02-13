import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import expectedBody from "./expectedBody";
import { EmailAuth } from "@/lib/db/schema/user/EmailAuth";
import sendEmail from "@/lib/email/sendEmail";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";

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
    if (!result)
      return NextResponse.json(
        { error: "Invalid Codeforces handle or codefoces error" },
        { status: 400 },
      );

    const { handle, titlePhoto } = result[0];

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
    await db
      .insert(UsersFullData)
      .values({
        userId: userId,
        cfHandle: registerData.cfHandle,
        username: registerData.username,
        imageURL: titlePhoto,
      })
      .execute();
    emailActivation(registerData, randomToken);

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

function emailActivation(
  registerData: typeof Users.$inferInsert,
  randomToken: string,
) {
  sendEmail({
    to: [registerData.gmail],
    subject: "Verify your email",
    html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Activate Your ICPC Account</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .header {
                background: #0073e6;
                color: white;
                padding: 15px;
                font-size: 24px;
                font-weight: bold;
                border-radius: 8px 8px 0 0;
            }
            .content {
                padding: 20px;
                color: #333;
            }
            .button {
                display: inline-block;
                background: #0073e6;
                color: white;
                padding: 12px 20px;
                text-decoration: none;
                font-size: 18px;
                font-weight: bold;
                border-radius: 5px;
                margin-top: 20px;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Welcome to ICPC Training Platform</div>
            <div class="content">
                <p>Dear ${registerData.username},</p>
                <p>Thank you for registering on the ICPC Training Platform! To complete your registration and start your learning journey, please activate your account by clicking the button below.</p>
                <a href="https://${process.env.URL ?? ""}/api/auth/verify?token=${randomToken}" class="button">Activate My Account</a>
                <p>Our platform helps you:</p>
                <ul style="text-align: left; padding-left: 20px;">
                    <li>Sign up, track tasks, and attend training sessions seamlessly.</li>
                    <li>Get smart recommendations for the best training opportunities.</li>
                    <li>Communicate easily through group chats, private messaging, and forums.</li>
                    <li>Learn efficiently with AI-powered hints, corrections, and resource suggestions.</li>
                </ul>
                <p>The ICPC Assiut University Community is a student-led initiative dedicated to enhancing problem-solving skills, creativity, and innovation. As part of Assiut University, it prepares students for national and international programming contests, including the ICPC. The community offers inclusive training for beginners, juniors, and seniors, equipping them with essential and advanced skills for competitive programming.</p>
                <p>If you did not sign up, you can ignore this email.</p>
            </div>
            <div class="footer">
                Need help? Contact us at <a href="mailto:support@${process.env.URL ?? ""}">support@icpcplatform.com</a>
            </div>
        </div>
    </body>
    </html>
    `.toString(),
  });
}
