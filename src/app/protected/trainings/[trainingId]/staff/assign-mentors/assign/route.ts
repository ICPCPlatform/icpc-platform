import { db } from "@/lib/db";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { trainingId: string } }) {
  try {
    const { traineeId, mentorId } = await req.json();
    if (!mentorId) {
      return NextResponse.json({ error: "Unassigning mentor is not supported." }, { status: 400 });
    }
    const trainingId = Number(params.trainingId);
    await db
      .update(Trainees)
      .set({ mentorId })
      .where(and(eq(Trainees.userId, traineeId), eq(Trainees.trainingId, trainingId)))
      .execute();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to assign mentor" }, { status: 400 });
  }
} 