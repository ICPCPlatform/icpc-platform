import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { userData } from "@/lib/session";
import adminOnly from "@/middelwares/adminOnly";
import expectedBody from "./_expectedBody";

async function POST(request: NextRequest, user: userData) {
  try {
    const { success, data: trainingData } = expectedBody.safeParse(
      await request.json(),
    );
    if (!success) {
      return new NextResponse(null, { status: 400 });
    }
    const training = {
      ...trainingData,
      headId: user.userId,
    };
    db.insert(Trainings).values(training).execute();
    return new NextResponse(null, { status: 201 });
  } catch (e) {
    console.log(e);
    return new NextResponse(null, { status: 500 });
  }
}

module.exports = { POST: adminOnly(POST) };
