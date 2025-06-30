"use server";
import "server-only";
import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { eq } from "drizzle-orm";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { getUserData } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// Zod validation schema for the updateStandingView action
const updateStandingViewSchema = z.object({
  trainingId: z.number().positive(),
  standingView: z.array(
    z.enum([
      "username",
      "name",
      "cfHandle",
      "vjudge",
      "gmail",
      "level",
      "university",
      "faculty",
    ]),
  ),
});

export async function updateStandingView(
  input: z.infer<typeof updateStandingViewSchema>,
) {
  try {
    const { trainingId, standingView } = updateStandingViewSchema.parse(input);
    const user = await getUserData();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const permissions = await getUserTrainingPermissions(
      user.userId,
      trainingId,
    );
    if (!permissions.includes("Edit:training")) {
      throw new Error("User does not have permissions for this training");
    }

    await db
      .update(Trainings)
      .set({ standingView })
      .where(eq(Trainings.trainingId, trainingId))
      .execute();

    revalidatePath(
      `/protected/trainings/${trainingId}/staff/edit-standing-view`,
    );
  } catch (error) {
    console.error("Error updating standing view:", error);
    throw new Error("Failed to update standing view");
  }
}
