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

    if (!mentorUserId) {
      throw new Error(`Mentor with username ${mentorUsername} not found.`);
    }
    if (!traineeUserId) {
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


    // insert the trainee into the trainees table
    await db.insert(Trainees).values({
      userId: traineeUserId,
      trainingId,
      mentorId: mentorUserId,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }
  }
}
