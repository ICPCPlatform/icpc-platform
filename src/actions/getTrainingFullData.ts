"use server";
import "server-only";
import { Faculties } from "@/lib/db/schema/user/Faculties";
import { Institutes } from "@/lib/db/schema/user/Institutes";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { Users } from "@/lib/db/schema/user/Users";
import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import {
  StandingEntry,
  StandingEntryWithDetails,
  Trainee,
  Training,
  TrainingFullData,
} from "@/lib/types/training";

const selectKeysFromObjects = (data: typeof ___, keys: string[]) => {
  return keys.reduce((acc, key) => {
    if (key in data) {
      // @ts-expect-error - This is a hack to get around the type system
      acc[key] = data[key];
    }
    return acc;
  }, {});
};

export async function getTrainingFullData({
  trainingId,
}: {
  trainingId: number;
}): Promise<TrainingFullData> {
  "use server";
  // Fetch training details
  const trainingResult = await db
    .select({
      standing: Trainings.standing,
      standingView: Trainings.standingView,
      material : Trainings.material
    })
    .from(Trainings)
    .where(eq(Trainings.trainingId, trainingId))
    .execute();

  const training: Training = trainingResult[0] as Training;

  // Find the standing for the current contest

  // Fetch trainee details for each trainee in the standing

  const { standingView, standing, material } = training;
  standingView.push("userId");
  const traineeIds = [
    ...new Set(standing.map((s) => s.rankings.map((r) => r.userId)).flat()),
  ].filter((id) => id !== undefined);
  const trainees: Trainee[] = (await db
    .select(selectKeysFromObjects(___, standingView))
    .from(Users)
    .leftJoin(UsersFullData, eq(UsersFullData.userId, Users.userId))
    .leftJoin(Institutes, eq(Institutes.id, UsersFullData.instituteId))
    .leftJoin(Faculties, eq(Faculties.id, UsersFullData.facultyId))
    .where(inArray(Users.userId, traineeIds))

    .execute()) as Trainee[];
  // Map standings to include trainee details
  const standingWithDetails: TrainingFullData["standing"] = standing.map(
    (contest) => {
      return {
        ...contest,
        rankings: contest.rankings
          .map((s: StandingEntry) => {
            if (s.userId === undefined) {
              return undefined;
            }
            const user = trainees.find((usr) => usr.userId === s.userId);
            if (user) {
              user.userId = undefined;
              const obj = {
                ...s,
                ...user, // Assuming penalty is used as points
              };
              return obj;
            }
            return undefined;
          })
          .filter((x) => x !== undefined) as StandingEntryWithDetails[],
      };
    },
  );

  return { standing: standingWithDetails, material };
}

const ___ = {
  userId: Users.userId,
  name: UsersFullData.firstNameEn,
  cfHandle: Users.cfHandle,
  vjudge: Users.vjHandle,
  gmail: Users.gmail,
  level: UsersFullData.academicYear,
  university: Institutes.name,
  faculty: Faculties.name,
};
