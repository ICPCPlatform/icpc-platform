"use server";
import "server-only";

import { db } from "@/lib/db";
import { z } from "zod";
import { updateContestSchema } from "@/lib/validation/training/updateContest";
import { Contests } from "@/lib/db/schema/training/Contests";
import UrlPattern from "url-pattern";
import { and, eq, isNull } from "drizzle-orm";
export async function addContestAction(
  input: z.infer<typeof updateContestSchema>,
) {
  try {
    const parsedData = updateContestSchema.parse(input);
    const { trainingId, blockNumber, type, title, description, date } =
      parsedData;

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
          isNull(Contests.deleted), // Ensure the contest is not already deleted
        ),
      )
      .execute();
  } catch (error) {
    console.error("Error adding contest:", error);
    throw new Error("Failed to add contest");
  }
}
