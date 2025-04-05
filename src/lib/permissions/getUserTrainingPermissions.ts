"use server";
import { db } from "@/lib/db";
import { Staff } from "../db/schema/training/Staff";
import { Trainees } from "../db/schema/training/Trainees";
import { eq, and, isNull } from "drizzle-orm";


export type TrainingPermissions = "View:standing" | "View:material" | "Edit:material";

async function getUserTrainingPermissionsNotCache(userId: string, trainingId: number) : Promise<TrainingPermissions[]> {
  if (isNaN(trainingId)) {
    return []
  }
  const staffRes = await db
    .select({
      mentor: Staff.mentor,
      problemSetter: Staff.problemSetter,
      instructor: Staff.instructor,
      coHead: Staff.coHead,
      manager: Staff.manager,
    })
    .from(Staff)
    .where(
      and(
        eq(Staff.userId, userId),
        eq(Staff.trainingId, trainingId),
        isNull(Staff.deleted),
      ),
    )
    .execute();
  if (staffRes.length === 1) {
    return ["View:standing", "View:material"];
  }
  const studentRes = await db
    .select({})
    .from(Trainees)
    .where(
      and(
        eq(Trainees.userId, userId),
        eq(Trainees.trainingId, trainingId),
        isNull(Trainees.deleted),
      ),
    )
    .execute();
  // TODO: check if user is trainee
  //
  if (studentRes.length === 1) {
    return ["View:standing", "View:material"];
  }
  return [];
}

export const getUserTrainingPermissions = getUserTrainingPermissionsNotCache
