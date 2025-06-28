"use server";
import "server-only";
import { unassignMentorSchema } from "@/lib/validation/training/unassignMentor";
import { z } from "zod";
import { db } from "@/lib/db";
import { and, eq, isNull } from "drizzle-orm";
import { Users } from "@/lib/db/schema/user/Users";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { getUserData } from "@/lib/session";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";

/**
 * Unassigns a mentor from a trainee in a training session.
 * @param input - The input data containing mentorId, traineeId, and trainingId.
 * @returns A promise that resolves when the mentor is successfully unassigned.
 * @throws {Error} If validation fails.
 * @throws {Error} If the mentor or trainee is not found.
 * @throws {Error} If the trainee is not assigned to the mentor in the training.
 * @throws {Error} If the caller doesn't have the write permissions
 * @description This function unassigns a mentor from a trainee in a training session by marking the assignment as deleted and setting mentorId to null.
 */
export async function unassignMentor(
  input: z.infer<typeof unassignMentorSchema>,
): Promise<void> {
  try {
    // check if the validation is valid
    unassignMentorSchema.parse(input);

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
      throw new Error("You do not have permission to unassign mentors.");
    }

    let effectiveMentorId = mentorId;

    if (!effectiveMentorId) {
      const assignedTrainee = await db
        .select({ mentorId: Trainees.mentorId })
        .from(Trainees)
        .where(
          and(
            eq(Trainees.trainingId, trainingId),
            eq(Trainees.userId, traineeId),
            isNull(Trainees.deleted),
          ),
        );

      if (assignedTrainee.length === 0 || !assignedTrainee[0].mentorId) {
        const traineeUsername = await getUsernameById(traineeId);

        throw new Error(
          `Trainee with username ${traineeUsername} is not currently assigned to any mentor in this training.`,
        );
      }
      effectiveMentorId = assignedTrainee[0].mentorId;
      if (!effectiveMentorId) {
        throw new Error(
          `Trainee with ID ${traineeId} is not currently assigned to any mentor in this training.`,
        );
      }
    }

    // check if the trainee is assigned to the mentor in this training
    if (
      (
        await db
          .select({})
          .from(Trainees)
          .where(
            and(
              eq(Trainees.trainingId, trainingId),
              eq(Trainees.userId, traineeId),
              eq(Trainees.mentorId, effectiveMentorId),
              isNull(Trainees.deleted),
            ),
          )
      ).length < 1
    ) {
      const traineeUsername = await getUsernameById(traineeId);
      if (!traineeUsername) {
        throw new Error(`Trainee with ID ${traineeId} not found.`);
      }
      throw new Error(
        `Trainee with username ${traineeUsername} isn't assigned to this mentor in this training.`,
      );
    }

    // insert the trainee into the trainees table
    await db
      .update(Trainees)
      .set({
        deleted: new Date(),
      })
      .where(
        and(
          eq(Trainees.trainingId, trainingId),
          eq(Trainees.userId, traineeId),
          eq(Trainees.mentorId, effectiveMentorId),
        ),
      );
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
