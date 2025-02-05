import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import expectedBody from "./expectedBody";

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

    const { status: _status, result } = await handleRes.json();
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
