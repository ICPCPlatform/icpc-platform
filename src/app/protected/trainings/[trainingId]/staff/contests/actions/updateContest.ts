"use server";
import "server-only";

import { db } from "@/lib/db";
import { z } from "zod";
import { updateContestSchema } from "@/lib/validation/training/updateContest";
import { Contests } from "@/lib/db/schema/training/Contests";
import { and, eq, isNull } from "drizzle-orm";
import { getUserData } from "@/lib/session";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { revalidatePath } from "next/cache";
export async function addContestAction(
  input: z.infer<typeof updateContestSchema>,
) {
  try {
    const parsedData = updateContestSchema.parse(input);
    const { trainingId, blockNumber, type, title, description, date, contestId} =
      parsedData;


    revalidatePath(`/protected/trainings/${trainingId}/staff/contests`);

    const user = await getUserData();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const { userId } = user;
    const permissions = await getUserTrainingPermissions(userId, trainingId);
    if (!permissions.includes("Edit:contest")) {
      throw new Error("User does not have permissions for this training");
    }
    const toSet = {
      type,
      title,
      description,
      date,
    };
    // remove undefined values

    Object.keys(toSet).forEach((key) => {
      // @ts-expect-error - ts doesn't know that toSet is a partial of Contests
      if (toSet[key] === undefined) {
        // @ts-expect-error - ts doesn't know that toSet is a partial of Contests
        delete toSet[key];
      }
    });

    await db
      .update(Contests)
      .set(toSet)
      .where(
        and(
          eq(Contests.trainingId, trainingId),
          eq(Contests.blockNumber, blockNumber),
          eq(Contests.contestId, contestId),
          isNull(Contests.deleted), // Ensure the contest is not already deleted
        ),
      )
      .execute();
  } catch (error) {
    console.error("Error adding contest:", error);
    throw new Error("Failed to add contest");
  }
}
