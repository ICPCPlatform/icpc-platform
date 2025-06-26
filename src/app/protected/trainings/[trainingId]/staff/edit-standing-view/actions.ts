"use server";
import "server-only";
import { db } from "@/lib/db";
import { Trainings, type StandingView } from "@/lib/db/schema/training/Trainings";
import { eq } from "drizzle-orm";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { getUserData } from "@/lib/session";
import { z } from "zod";

// Zod validation schema for the updateStandingView action
const updateStandingViewSchema = z.object({
  trainingId: z.number().positive(),
  standingView: z.array(z.enum(["name", "cfHandle", "vjudge", "gmail", "level", "university", "faculty"])),
});

export async function updateStandingView({
  trainingId,
  standingView,
}: {
  trainingId: number;
  standingView: StandingView[];
}) {
  // Validate input using Zod
  const validationResult = updateStandingViewSchema.safeParse({ trainingId, standingView });
  if (!validationResult.success) {
    return { success: false, error: "Invalid input data", details: validationResult.error.errors };
  }

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