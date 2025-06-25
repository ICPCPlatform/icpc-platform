"use server";
import "server-only";
import { db } from "@/lib/db";
import { Trainings, type StandingView } from "@/lib/db/schema/training/Trainings";
import { eq } from "drizzle-orm";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { getUserData } from "@/lib/session";

export async function updateStandingView({
  trainingId,
  standingView,
}: {
  trainingId: number;
  standingView: StandingView[];
}) {
  const user = await getUserData();
  if (!user) {
    return { success: false, error: "Not authenticated" };
  }
  const permissions = await getUserTrainingPermissions(user.userId, trainingId);
  if (!permissions.includes("Edit:standing")) {
    return { success: false, error: "Permission denied" };
  }
  await db
    .update(Trainings)
    .set({ standingView })
    .where(eq(Trainings.trainingId, trainingId))
    .execute();
  return { success: true };
} 