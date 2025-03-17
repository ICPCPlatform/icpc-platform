import { type NextRequest, NextResponse } from "next/server";

import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { userId, trainingId } = (await req.json()) as {
      userId: string;
      trainingId: number;
    };
    const res = await getUserTrainingPermissions(userId, trainingId);
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    console.error(error);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
