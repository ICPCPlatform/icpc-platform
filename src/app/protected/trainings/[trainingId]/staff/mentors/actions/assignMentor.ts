"use server";
import "server-only";
import { assignMentorSchema } from "@/lib/validation/training/assignMentor";
import { z } from "zod";
import { db } from "@/lib/db";
import { and, eq, isNull } from "drizzle-orm";
import { Users } from "@/lib/db/schema/user/Users";
import { Staff } from "@/lib/db/schema/training/Staff";
import { Trainees } from "@/lib/db/schema/training/Trainees";

async function assignMentor(
  input: z.infer<typeof assignMentorSchema>,
): Promise<void> {
  console.log("assignMentor called with:", input);
  try {
    // check if the validation is valid
    assignMentorSchema.parse(input);

    const { mentorUsername, traineeUsername, trainingId } = input;
    // get userId from the database
    const mentorUserId = (
      await db
        .select({ userId: Users.userId })
        .from(Users)
        .where(eq(Users.username, mentorUsername))
    ).at(0)?.userId;

    const traineeUserId = (
      await db
        .select({ userId: Users.userId })
        .from(Users)
        .where(eq(Users.username, traineeUsername))
    ).at(0)?.userId;

    console.log("Resolved mentorUserId:", mentorUserId, "traineeUserId:", traineeUserId);

    if (!mentorUserId) {
      console.error(`Mentor with username ${mentorUsername} not found.`);
      throw new Error(`Mentor with username ${mentorUsername} not found.`);
    }
    if (!traineeUserId) {
      console.error(`Trainee with username ${traineeUsername} not found.`);
      throw new Error(`Trainee with username ${traineeUsername} not found.`);
    }

    if (
      (
        await db
          .select({})
          .from(Staff)
          .where(
            and(
              eq(Staff.trainingId, trainingId),
              eq(Staff.userId, mentorUserId),
              isNull(Staff.deleted),
              eq(Staff.mentor, true),
            ),
          )
      ).length < 1
    ) {
      throw new Error(
        `Mentor with username ${mentorUsername} is not assigned to this training.`,
      );
    }

    if (
      (
        await db
          .select({})
          .from(Trainees)
          .where(
            and(
              eq(Trainees.trainingId, trainingId),
              eq(Trainees.userId, traineeUserId),
              eq(Trainees.mentorId, mentorUserId),
            ),
          )
      ).length >= 1
    ) {
      throw new Error(
        `Trainee with username ${traineeUsername} is already assigned to mentor with username ${mentorUsername} in this training. or was assigned and deleted`,
      );
    }

    if (
      (
        await db
          .select({})
          .from(Trainees)
          .where(
            and(
              eq(Trainees.trainingId, trainingId),
              eq(Trainees.userId, traineeUserId),
              isNull(Trainees.deleted),
            ),
          )
      ).length >= 1
    ) {
      throw new Error(
        `Trainee with username ${traineeUsername} is already assigned to a mentor in this training`,
      );
    }

    // Check if trainee already exists for this training
    const existingTrainee = await db
      .select({ userId: Trainees.userId })
      .from(Trainees)
      .where(
        and(
          eq(Trainees.trainingId, trainingId),
          eq(Trainees.userId, traineeUserId),
          isNull(Trainees.deleted),
        )
      )
      .then(rows => rows[0]);

    if (existingTrainee) {
      console.log("Updating mentor for existing trainee:", traineeUserId, "to", mentorUserId);
      await db.update(Trainees)
        .set({ mentorId: mentorUserId })
        .where(
          and(
            eq(Trainees.trainingId, trainingId),
            eq(Trainees.userId, traineeUserId),
            isNull(Trainees.deleted),
          )
        );
    } else {
      console.log("Inserting new trainee with mentor:", traineeUserId, mentorUserId);
      await db.insert(Trainees).values({
        userId: traineeUserId,
        trainingId,
        mentorId: mentorUserId,
      });
    }

  } catch (error) {
    console.error("assignMentor error:", error);
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }
    throw error;
  }
}

export { assignMentor };