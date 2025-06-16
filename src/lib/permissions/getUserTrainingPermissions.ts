"use server";
import { db } from "@/lib/db";
import { Staff } from "../db/schema/training/Staff";
import { Trainees } from "../db/schema/training/Trainees";
import { eq, and, isNull } from "drizzle-orm";
import { Trainings } from "../db/schema/training/Trainings";




type PermissionAction = "View" | "Edit";
type PermissionTarget =
  | "standing"
  | "material"
  | "block"
  | "training"
  | "practice"
  | "attendance"
  | "contest"
  | "staff";

export type TrainingPermissions =
  | `${PermissionAction}:${PermissionTarget}` | "View:trainee";

async function getUserTrainingPermissionsNotCache(
  userId: string,
  trainingId: number,
): Promise<TrainingPermissions[]> {
  if (isNaN(trainingId)) {
    return [];
  }
  const headRes = await db
    .select({})
    .from(Trainings)
    .where(
      and(eq(Trainings.trainingId, trainingId), eq(Trainings.headId, userId)),
    )
    .execute();
  if (headRes.length === 1) {
    return [
      "View:standing",
      "Edit:standing",
      "View:material",
      "Edit:material",
      "Edit:contest",
      "Edit:block",
      "View:practice",
      "Edit:practice",
      "View:attendance",
      "Edit:attendance",
      "Edit:staff",
    ];
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
    const permissions: Set<TrainingPermissions> = new Set();

    // Base permissions for all staff
    (
      [
        "View:standing",
        "View:material",
        "View:practice",
        "View:attendance",
        "Edit:attendance",
        "View:trainee"
      ] as const
    ).forEach((perm) => permissions.add(perm));

    // Manager permissions
    if (staff.manager) {
      // all permissions
      (
        [
          "View:standing",
          "Edit:standing",
          "View:material",
          "Edit:material",
          "View:practice",
          "Edit:practice",
          "View:attendance",
          "Edit:attendance",
          "View:contest",
          "Edit:contest",
          "View:block",
          "Edit:block",
          "Edit:training",
            "View:training",
          "View:trainee",
        ] as const
      ).forEach((perm) => permissions.add(perm));
    }

    // Instructor permissions
    if (staff.instructor) {
      permissions.add("Edit:material");
      permissions.add("View:material");
    }

    // Mentor permissions
    if (staff.mentor) {
      permissions.add("Edit:practice");
      permissions.add("View:practice");
    }

    return [...permissions];
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
    return ["View:trainee"]; //
  }

  return [];
}

export const getUserTrainingPermissions = getUserTrainingPermissionsNotCache;
