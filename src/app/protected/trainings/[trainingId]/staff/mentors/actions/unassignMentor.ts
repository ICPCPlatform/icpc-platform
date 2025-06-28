"use server";
import "server-only";
import { assignMentorSchema } from "@/lib/validation/training/assignMentor";
import { z } from "zod";
import { db } from "@/lib/db";
import { and, eq, isNotNull, isNull, or } from "drizzle-orm";
import { Users } from "@/lib/db/schema/user/Users";
import { Staff } from "@/lib/db/schema/training/Staff";
import { Trainees } from "@/lib/db/schema/training/Trainees";

async function unassignMentor(
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
          .from(Trainees)
          .where(
            and(
              eq(Trainees.trainingId, trainingId),
              eq(Trainees.userId, traineeUserId),
              eq(Trainees.mentorId, mentorUserId),
              isNotNull(Trainees.deleted)
            ),
          )
      ).length < 1
    ) {
      throw new Error(
        `Trainee with username ${traineeUsername} is assigned to mentor ${mentorUsername} in this training.`,
      );
    }



    // insert the trainee into the trainees table
    await db.update(Trainees).set({
      userId: traineeUserId,
      trainingId,
      mentorId: mentorUserId,
      deleted: new Date(),
    }).where(
      and(
        eq(Trainees.trainingId, trainingId),
        eq(Trainees.userId, traineeUserId),
        eq(Trainees.mentorId, mentorUserId),
      ),
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`,
      );
    }
  }
}

export { unassignMentor };