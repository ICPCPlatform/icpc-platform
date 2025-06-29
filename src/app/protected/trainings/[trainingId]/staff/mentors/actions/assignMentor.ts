"use server";
import "server-only";
import { assignMentorSchema } from "@/lib/validation/training/assignMentor";
import { z } from "zod";
import { db } from "@/lib/db";
import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { Users } from "@/lib/db/schema/user/Users";
import { Staff } from "@/lib/db/schema/training/Staff";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { Applications } from "@/lib/db/schema/training/Applications";
import { getUserData } from "@/lib/session";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { revalidatePath } from "next/cache";

/**
 * Assigns a mentor to a trainee in a training session.
 * @param input - The input data containing mentorId, traineeId, and trainingId.
 * @returns A promise that resolves when the mentor is successfully assigned.
 * @throws {Error} If validation fails.
 * @throws {Error} If the trainee is not accepted in the training.
 * @throws {Error} If the mentor is not a staff member or not assigned to the training.
 * @throws {Error} If the trainee is already assigned to the given mentor in the training.
 * @throws {Error} If the trainee is already assigned to a different mentor in the training.
 * @throws {Error} If the caller doesn't have the write permissions
 * @description This function assigns a mentor to a trainee within a specific training session.
 */
export async function assignMentor(
  input: z.infer<typeof assignMentorSchema>,
): Promise<void> {
  console.log("assignMentor called with:", input);
  try {
    // check if the validation is valid
    assignMentorSchema.parse(input);

    const { mentorId, traineeId, trainingId } = input;

    const user = await getUserData();
    if (!user) {
      throw new Error("You must be logged in to perform this action.");
    }

    const permissions = await getUserTrainingPermissions(
      user.userId,
      trainingId,
    );

    if (!permissions.includes("Edit:staff")) {
      throw new Error("You do not have permission to assign mentors.");
    }

    if (
      (
        await db
          .select()
          .from(Applications)
          .where(
            and(
              eq(Applications.trainingId, trainingId),
              eq(Applications.userId, traineeId),
              eq(Applications.status, "accepted"),
            ),
          )
      ).length < 1
    ) {
      const traineeUsername = await getUsernameById(traineeId);
      if (traineeUsername) {
        throw new Error(
          `Trainee with username ${traineeUsername} is not accepted in this training.`,
        );
      }
      throw new Error(
        `Trainee with ID ${traineeId} is not found in this training or not accepted.`,
      );
    }

    if (
      (
        await db
          .select({})
          .from(Staff)
          .where(
            and(
              eq(Staff.trainingId, trainingId),
              eq(Staff.userId, mentorId),
              isNull(Staff.deleted),
              eq(Staff.mentor, true),
            ),
          )
      ).length < 1
    ) {
      const mentorUsername = await getUsernameById(mentorId);
      if (mentorUsername) {
        throw new Error(
          `Mentor with username ${mentorUsername} is not assigned to this training or is not a mentor.`,
        );
      }
      throw new Error(
        `Mentor with ID ${mentorId} is not found or not assigned to this training.`,
      );
    }

    // Check if trainee is already assigned to this specific mentor
    if (
      (
        await db
          .select({})
          .from(Trainees)
          .where(
            and(
              eq(Trainees.trainingId, trainingId),
              eq(Trainees.userId, traineeId),
              eq(Trainees.mentorId, mentorId),
              isNull(Trainees.deleted),
            ),
          )
      ).length >= 1
    ) {
      const mentorUsername = await getUsernameById(mentorId);
      const traineeUsername = await getUsernameById(traineeId);

      if (!mentorUsername || !traineeUsername) {
        throw new Error(
          `Mentor or trainee with ID ${mentorId} or ${traineeId} not found.`,
        );
      }
      throw new Error(
        `Trainee with username ${traineeUsername} is already assigned to mentor with username ${mentorUsername} in this training.`,
      );
    }

    // Check if trainee is in the trainees table (not deleted)
    if (
      (
        await db
          .select({})
          .from(Trainees)
          .where(
            and(
              eq(Trainees.trainingId, trainingId),
              eq(Trainees.userId, traineeId),
              isNull(Trainees.deleted),
            ),
          )
      ).length >= 1
    ) {
      const traineeUsername = await getUsernameById(traineeId);
      if (traineeUsername) {
        throw new Error(
          `Trainee with username ${traineeUsername} is not in this training.`,
        );
      }
      throw new Error(
        `Trainee with ID ${traineeId} is not found in this training.`,
      );
    }

    // Check if trainee is already assigned to *any* mentor
    const existingTrainee = await db
      .select({})
      .from(Trainees)
      .where(
        and(
          eq(Trainees.trainingId, trainingId),
          eq(Trainees.userId, traineeId),
          isNull(Trainees.deleted),
        ),
      );

    if (existingTrainee.length > 0) {
      // If trainee exists and is assigned to a *different* mentor
      throw new Error(
        `Trainee with ID ${traineeId} is already assigned to a different mentor in this training.`,
      );
    } else {
      // If trainee exists but no mentor, or if trainee does not exist in Trainees table

      if (
        (
          await db
            .select({})
            .from(Trainees)
            .where(
              and(
                eq(Trainees.trainingId, trainingId),
                eq(Trainees.userId, traineeId),
                isNotNull(Trainees.deleted),
              ),
            )
        ).length > 0
      ) {
        // If trainee exists but is marked as deleted, we can reassign them
        await db
          .update(Trainees)
          .set({ deleted: null, mentorId })
          .where(
            and(
              eq(Trainees.trainingId, trainingId),
              eq(Trainees.userId, traineeId),
              eq(Trainees.mentorId, mentorId),
            ),
          );
        return;
      }
      // If trainee does not exist in Trainees table, insert them
      await db.insert(Trainees).values({
        userId: traineeId,
        trainingId,
        mentorId: mentorId,
        deleted: null,
      });
    }

    revalidatePath(`/protected/trainings/${trainingId}/staff/assign-mentors`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }
    throw error;
  }
}

async function getUsernameById(userId: string): Promise<string | null> {
  const user = await db
    .select({ username: Users.username })
    .from(Users)
    .where(eq(Users.userId, userId))
    .then((rows) => rows[0]);

  return user ? user.username : null;
}
