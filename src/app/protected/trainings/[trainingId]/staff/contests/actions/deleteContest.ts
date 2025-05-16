"use server";
import "server-only";

import { db } from "@/lib/db";
import { z } from "zod";
import { Contests } from "@/lib/db/schema/training/Contests";
import { deleteContestSchema } from "@/lib/validation/training/deleteContest";
import { and, eq, isNull } from "drizzle-orm";

export async function deleteContestAction(
  input: z.infer<typeof deleteContestSchema>,
) {
  try {
    const parsedData = deleteContestSchema.parse(input);
    const { trainingId, blockNumber, contestId } = parsedData;

    const res = await db
      .update(Contests)
      .set({
        deleted: new Date(),
      })
      .where(
        and(
          eq(Contests.trainingId, trainingId),
          eq(Contests.blockNumber, blockNumber),
          eq(Contests.contestId, contestId),
          isNull(Contests.deleted), // Ensure the contest is not already deleted
        ),
      )
      .returning()
      .execute();
    if (res.length === 0) {
      throw new Error("Contest not found or already deleted");
    }
  } catch (error) {
    console.error("Error deleting contest:", error);
    throw new Error("Failed to delete contest");
  }
}
