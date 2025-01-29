import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { encryptSession } from "@/lib/session";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const expectedBody = z.object({
  username: z.string(),
  password: z.string(),
  gmail: z
    .string()
    .email()
    .regex(/@gmail.com$/),
  phoneNumber: z
    .string()
    .min(11)
    .max(11)
    .regex(/^01\d+$/),
  cfHandle: z.string(),
});

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

    const { _status, result } = await handleRes.json();
    if (!result)
      return NextResponse.json(
        { error: "Invalid Codeforces handle or codefoces error" },
        { status: 400 },
      );

    const handle = z.string().parse(result.handle);

    if (handle.toLowerCase() === registerData.cfHandle.toLowerCase())
      return NextResponse.json(
        { error: "Invalid Codeforces handle or codefoces error" },
        { status: 400 },
      );

    registerData.password = await bcrypt.hash(
      registerData.password,
      process.env.HASH_SALT ?? 10,
    );

    await db.insert(Users).values(registerData).execute();

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
