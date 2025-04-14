"use server";
import { db } from "@/lib/db";
import { Staff } from "../db/schema/training/Staff";
import { Trainees } from "../db/schema/training/Trainees";
import { eq, and, isNull } from "drizzle-orm";

export type TrainingPermissions = 
  | "View:standing" 
  | "Edit:standing"
  | "View:material" 
  | "Edit:material"
  | "Edit:contest"
  | "Edit:block"
  | "View:practice"
  | "Edit:practice"
  | "View:attendance"
  | "Edit:attendance";

async function getUserTrainingPermissionsNotCache(userId: string, trainingId: number): Promise<TrainingPermissions[]> {
  if (isNaN(trainingId)) {
    return [];
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
    const staff = staffRes[0];
    const permissions: TrainingPermissions[] = [];

    // Base permissions for all staff
    permissions.push("View:standing", "View:material", "View:practice", "View:attendance", "Edit:attendance");

    // Manager permissions
    if (staff.manager) {
      permissions.push(
        "Edit:standing",
        "Edit:material",
        "Edit:contest",
        "Edit:block",
        "Edit:practice"
      );
    }

    // Instructor permissions
    if (staff.instructor) {
      permissions.push("Edit:material");
    }

    // Mentor permissions
    if (staff.mentor) {
      permissions.push("Edit:practice");
    }

    return [...new Set(permissions)]; // Remove duplicates
  }

  // Check if user is a trainee
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

  if (studentRes.length === 1) {
    return ["View:standing", "View:material", "View:practice"];
  }

  return [];
}

export const getUserTrainingPermissions = getUserTrainingPermissionsNotCache;
