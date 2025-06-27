import { db } from "@/lib/db";
import { Staff } from "@/lib/db/schema/training/Staff";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { and, eq, isNull } from "drizzle-orm";

export type StaffRole =
  | "mentor"
  | "problem_setter"
  | "instructor"
  | "co_head"
  | "manager"
  | "head"
  | "chief_judge";

/**
 * Fetches the staff roles for a given user in a specific training.
 * @param userId The ID of the user.
 * @param trainingId The ID of the training.
 * @returns An array of staff roles, or an empty array if the user has no staff roles.
 */
export async function getStaffRoles({
  userId,
  trainingId,
}: {
  userId?: string;
  trainingId: number;
}): Promise<StaffRole[]> {
  if( !userId || !trainingId) {
    return [];
  }
  const userRoles: StaffRole[] = [];
  // Check staff table
  const dbResult = await db
    .select({
      trainingHeadId: Trainings.headId,
      chiefJudgeId: Trainings.chiefJudge,
    })
    .from(Trainings)
    .where(and(eq(Staff.trainingId, trainingId), isNull(Staff.deleted)))
    .execute();

  const { trainingHeadId, chiefJudgeId } = dbResult[0] || {};
  const staffRows = await db
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

  if (staffRows.length > 0) {
    const staff = staffRows[0];
    if (staff.manager) {
      userRoles.push("manager");
    }
    if (staff.instructor) {
      userRoles.push("instructor");
    }
    if (staff.mentor) {
      userRoles.push("mentor");
    }
    if (staff.problemSetter) {
      userRoles.push("problem_setter");
    }
    if (staff.coHead) {
      userRoles.push("co_head");
    }
  }

  // Check head_id and chief_judge
  if (userId === trainingHeadId) userRoles.push("head");
  if (userId === chiefJudgeId) userRoles.push("chief_judge");

  return userRoles;
}
