"use server";
import "server-only";

import { db } from "@/lib/db";
import { z } from "zod";
import { addContestSchema } from "@/lib/validation/training/addContest";
import { Contests } from "@/lib/db/schema/training/Contests";
import UrlPattern from "url-pattern";
import { getUserData } from "@/lib/session";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { revalidatePath } from "next/cache";
export async function addContestAction(
  input: z.infer<typeof addContestSchema>,
) {
  try {
    const parsedData = addContestSchema.parse(input);
    const {
      trainingId,
      blockNumber,
      contestUrl,
      type,
      title,
      description,
      date,
    } = parsedData;

    const user = await getUserData();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const { userId  } = user;
    const permissions = await getUserTrainingPermissions(userId, trainingId);
    if (!permissions.includes("Edit:contest")) {
      throw new Error("User does not have permissions for this training");
    }

    const pattern = new UrlPattern(
      "(http(s)\\://)(:subdomain.):domain.:tld(\\::port)(/group/:groupId)/contest/:contestId",
    );
    const match = pattern.match(contestUrl);
    if (!match) throw new Error("Invalid contest URL");
    const { groupId, contestId, domain } = match;
    if (!contestId) throw new Error("Invalid contest URL");
    const judge = (function () {
      if (domain === "codeforces") {
        return "cf";
      } else if (domain === "vjudge") {
        return "vj";
      } else {
        throw new Error("Invalid contest URL");
      }
    })();

    await db
      .insert(Contests)
      .values({
        trainingId,
        blockNumber,
        contestId,
        judge,
        groupId: groupId ?? null,
        type,
        title,
        description: description ?? "",
        date,
      })
      .execute();
      revalidatePath(`/protected/trainings/${trainingId}`);
  } catch (error) {
    console.error("Error adding contest:", error);
    throw new Error("Failed to add contest");
  }
}
