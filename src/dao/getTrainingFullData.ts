"use server";
import "server-only";
import { Faculties } from "@/lib/db/schema/user/Faculties";
import { Institutes } from "@/lib/db/schema/user/Institutes";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { Users } from "@/lib/db/schema/user/Users";
import { and,eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import {
  Ranking,
  RankingEntryWithDetails,
  Trainee,
  Training,
  TrainingFullDTO,
} from "@/lib/types/training";
const selectKeysFromObjects = (data: typeof userSelectFields , keys: string[]) => {
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
    })
    .from(Trainings)
    .where(eq(Trainings.trainingId, trainingId))
    .execute();
  const training: Training = trainingResult[0] satisfies Training;
  
  const blocksResult = await db
    .select({id: Blocks.blockNumber, title: Blocks.title, materials: Blocks.material})
    .from(Blocks)
    .where(and(eq(Blocks.trainingId, trainingId),eq(Blocks.hidden, false),isNull(Blocks.deleted)))
    .execute();
  
  const blocks = blocksResult satisfies TrainingFullDTO["blocks"];
  blocks.sort((a, b) => a.id - b.id);

  // Find the standing for the current contest

  // Fetch trainee details for each trainee in the standing
    
  const { standingView, standing } = training;
   
  // Add userId to the standing view to fetch trainee details
  const traineeIds = [
    ...new Set(standing?.map((s) => s.rankings.map((r) => r.userId)).flat()),
  ].filter((id) => id !== undefined);

  const trainees: Trainee[] = (await db
    .select({...selectKeysFromObjects(userSelectFields , standingView),  userId: Users.userId,
    })
    .from(Users)
    .leftJoin(UsersFullData, eq(UsersFullData.userId, Users.userId))
    .leftJoin(Institutes, eq(Institutes.id, UsersFullData.instituteId))
    .leftJoin(Faculties, eq(Faculties.id, UsersFullData.facultyId))
    .where(inArray(Users.userId, traineeIds))
    .execute()) satisfies Trainee[];
    
  // Map standings to include trainee detailst
  
  const standingWithDetails: TrainingFullDTO["standing"] = standing?.map(
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

  return { standing: standingWithDetails, blocks: blocks };
}

const userSelectFields  = {
  name: UsersFullData.firstNameEn,
  cfHandle: Users.cfHandle,
  vjudge: Users.vjHandle,
  gmail: Users.gmail,
  level: UsersFullData.academicYear,
  university: Institutes.name,
  faculty: Faculties.name,
};
