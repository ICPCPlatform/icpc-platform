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
  Ranking,
  RankingEntryWithDetails,
  Trainee,
  Training,
  TrainingFullDTO,
} from "@/lib/types/Training";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { Block } from "@/lib/types/training";

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
}): Promise<TrainingFullDTO> {
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
  const standingWithDetails: TrainingFullDTO["standing"] = standing.map(
    (contest) => {
      
      return {
        ...contest,
        rankings: contest.rankings
          .map((s: Ranking) => {
            if (s.userId === undefined) {
              return undefined;
            }
            const user = trainees.find((usr) => usr.userId === s.userId);
            if (user) {
              const obj = {
                ...s,
                ...user, // Assuming penalty is used as points
                userId: undefined,
              };
              return obj;
            }
            return undefined;
          })
          .filter((x) => x !== undefined) as RankingEntryWithDetails[],
      };
    },
  );

  const processedBlocks = await db
    .select()
    .from(Blocks)
    .where(eq(Blocks.trainingId, trainingId)); 


    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
     const blocksWithDetails: Block[] = processedBlocks.map((block) => {
      return {
        trainingId: block.trainingId,
        blockNumber: block.blockNumber,
        title: block.title,
        description: block.description,
      };
    });
    

  return { standing: standingWithDetails, materials: material, blocks: blocksWithDetails };
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
