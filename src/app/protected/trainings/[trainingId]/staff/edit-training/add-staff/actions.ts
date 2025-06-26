"use server";

import { db } from "@/lib/db";
import { Staff } from "@/lib/db/schema/training/Staff";
import { getUserData } from "@/lib/session";
import { Users } from "@/lib/db/schema/user/Users";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Trainees } from "@/lib/db/schema/training/Trainees";

const addStaffSchema = z.object({
  trainingId: z.coerce.number().int().positive(),
  username: z.string().min(1, "User ID is required"),
  roles: z.object({
    instructor: z.boolean(),
    problem_setter: z.boolean(),
    mentor: z.boolean(),
  }),
});

const deleteStaffSchema = z.object({
  trainingId: z.coerce.number().int().positive(),
  username: z.string().min(1, "User ID is required"),
});
const searchByUsernameSchema = z.object({
  username: z.string().min(3, "Username is required"),
  trainingId: z.coerce.number().int().positive(),
});

const updateStaffSchema = z.object({
  trainingId: z.coerce.number().int().positive(),
  username: z.string().min(1, "User ID is required"),
  roles: z.object({
    instructor: z.boolean(),
    problem_setter: z.boolean(),
    mentor: z.boolean(),
  }),
});

// Helper to get userId by username
async function getUserIdByUsername(username: string) {
  const res = await db
    .select({ userId: Users.userId })
    .from(Users)
    .where(eq(Users.username, username))
    .execute();
  if (res.length === 0) throw Error("user not found");
  return res[0].userId;
}

// Helper to revalidate path
function getRevalidatePath(trainingId: string | number) {
  return `/protected/trainings/${trainingId}/staff/edit-training/add-staff`;
}

// Helper for schema validation
function validateSchema<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) throw Error(result.error.errors[0].message);
  return result.data;
}

// Helper for consistent error response
function errorResponse(error: unknown, fallback = "An error occurred"): {success: false, error: string} {
  console.error(error);
  return { success: false, error: error instanceof Error ? error.message : fallback };
}

export async function addStaffAction({
  trainingId,
  username,
  roles,
}:  {
  trainingId: string | number;
  username: string;
  roles: { instructor: boolean; problem_setter: boolean; mentor: boolean };
}) : Promise<{success: true} | {success:false, error: string}> {
  try {
    validateSchema(addStaffSchema, { trainingId, username, roles });
    const userId = await getUserIdByUsername(username);
    const insertData = {
      trainingId: Number(trainingId),
      userId,
      instructor: roles.instructor,
      problemSetter: roles.problem_setter,
      mentor: roles.mentor,
    } satisfies typeof Staff.$inferInsert;
    await db.insert(Staff).values(insertData).execute();
    revalidatePath(getRevalidatePath(trainingId));
    return { success: true };
  } catch (error) {
    return errorResponse(error, "Failed to add staff");
  }
}

export async function searchByUsername(username: string, trainingId: number) {
  try {
    validateSchema(searchByUsernameSchema, { username, trainingId });
    const userData = await getUserData();
    if (userData == null || userData.role !== "admin") {
      throw Error("Unauthorized access");
    }
    const staff = await db
      .select({
        username: Users.username,
        instructor: Staff.instructor,
        problemSetter: Staff.problemSetter,
        mentor: Staff.mentor,
      })
      .from(Users)
      .where(eq(Users.username, username))
      .leftJoin(
        Staff,
        and(eq(Staff.userId, Users.userId), eq(Staff.trainingId, trainingId)),
      )
      .execute();
    revalidatePath(getRevalidatePath(trainingId));
    return staff;
  } catch (error) {
    return errorResponse(error, "Error occurred while searching for user");
  }
}

export async function deleteStaff({
  trainingId,
  username,
}: {
  trainingId: string | number;
  username: string;
}) {
  try {
    validateSchema(deleteStaffSchema, { trainingId, username });
    const userId = await getUserIdByUsername(username);
    const assignedTrainees = await db
      .select({})
      .from(Trainees)
      .where(
        and(
          eq(Trainees.mentorId, userId),
          eq(Trainees.trainingId, Number(trainingId)),
          isNull(Trainees.deleted),
        ),
      )
      .execute();
    if (assignedTrainees.length > 0) {
      return {
        success: false,
        error: "Cannot delete staff member who has trainees assigned",
      };
    }
    await db
      .update(Staff)
      .set({ deleted: new Date() })
      .where(
        and(
          eq(Staff.userId, userId),
          eq(Staff.trainingId, Number(trainingId)),
        ),
      )
      .execute();
    revalidatePath(getRevalidatePath(trainingId));
    return { success: true };
  } catch (error) {
    return errorResponse(error, "Failed to delete staff");
  }
}

export async function updateStaff({
  trainingId,
  username,
  roles,
}: {
  trainingId: string | number;
  username: string;
  roles: { instructor: boolean; problem_setter: boolean; mentor: boolean };
}) {
  try {
    validateSchema(updateStaffSchema, { trainingId, username, roles });
    const userId = await getUserIdByUsername(username);
    const isAssigned2aTrainee = await db
      .select({})
      .from(Trainees)
      .where(
        and(
          eq(Trainees.mentorId, userId),
          eq(Trainees.trainingId, Number(trainingId)),
          isNull(Trainees.deleted),
        ),
      )
      .execute();
    if (isAssigned2aTrainee.length > 0 && !roles.mentor) {
      return {
        success: false,
        error: "Cannot remove mentor role while there are trainees assigned",
      };
    }
    await db
      .update(Staff)
      .set({
        instructor: roles.instructor,
        problemSetter: roles.problem_setter,
        mentor: roles.mentor,
        deleted: null,
      })
      .where(
        and(
          eq(Staff.userId, userId),
          eq(Staff.trainingId, Number(trainingId)),
        ),
      )
      .execute();
    revalidatePath(getRevalidatePath(trainingId));
    return { success: true };
  } catch (error) {
    return errorResponse(error, "Failed to update staff");
  }
}
