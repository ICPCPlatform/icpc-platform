"use server";
import "server-only";
import { Faculties } from "@/lib/db/schema/user/Faculties";
import { Institutes } from "@/lib/db/schema/user/Institutes";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { Users } from "@/lib/db/schema/user/Users";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import {
  TrainingFullDTO,
  LeaderBoardEntry,
} from "@/lib/types/Training";
import { Contests } from "@/lib/db/schema/training/Contests";

export async function getTrainingFullData({
  trainingId,
}: {
  trainingId: number;
  userId?: string;
}): Promise<TrainingFullDTO > {
  // Fetch training details
  const trainingResult = await db
    .select({
      leaderBoard: Trainings.leaderBoard,
      standingView: Trainings.standingView,
      headId: Trainings.headId,
      chiefJudge: Trainings.chiefJudge,
      title: Trainings.title,
    })
    .from(Trainings)
    .where(eq(Trainings.trainingId, trainingId))
    .execute();

  const training = trainingResult[0];
  if (!training) {
    throw new Error("Training not found");
  }

  const { standingView, leaderBoard ,title} = training;
  // leaderBoard is expected to be an array of { userId, points }
  const leaderBoardEntry: LeaderBoardEntry[] = Array.isArray(leaderBoard)
    ? leaderBoard
    : [];

  // Get all userIds in the leaderboard
  const traineeIds = leaderBoardEntry
    .map((entry) => entry.userId)
    .filter((id) => id !== undefined);

  // Fetch blocks as they are needed for the contests query within Promise.all
  const blocksResult = await db
    .select({
      id: Blocks.blockNumber,
      title: Blocks.title,
      materials: Blocks.material,
      description: Blocks.description,
    })
    .from(Blocks)
    .where(
      and(
        eq(Blocks.trainingId, trainingId),
        eq(Blocks.hidden, false),
        isNull(Blocks.deleted),
      ),
    )
    .execute();

  const [trainees, constestEntries] = await Promise.all([
    db
      .select({
        ...selectKeysFromObjects(userSelectFields, standingView),
        userId: Users.userId,
      })
      .from(Users)
      .leftJoin(UsersFullData, eq(UsersFullData.userId, Users.userId))
      .leftJoin(Institutes, eq(Institutes.id, UsersFullData.instituteId))
      .leftJoin(Faculties, eq(Faculties.id, UsersFullData.facultyId))
      .where(inArray(Users.userId, traineeIds))
      .execute(),
    db
      .select({
        standing: Contests.standing,
      })
      .from(Contests)
      .where(
        and(
          eq(Contests.trainingId, trainingId),
          isNull(Contests.deleted),
          inArray(
            Contests.blockNumber,
            blocksResult.map((x: { id: number }) => x.id),
          ),
        ),
      ),
  ]);

  const traineesMap = new Map(
    trainees.map((trainee) => {
      const { userId, ...rest } = trainee;
      return [userId, rest];
    }),
  );

  // Merge leaderboard points with user details
  const leaderBoardWithTrainees = leaderBoardEntry
    .map((entry) => {
      const user = traineesMap.get(entry.userId);
      if (!user) {
        return undefined; // Skip if user not found
      }
      return {
        ...user,
        points: entry.points,
      };
    })
    .filter(
      (entry) => entry !== undefined,
    ) satisfies TrainingFullDTO["leaderBoard"];

  const blocks = blocksResult satisfies TrainingFullDTO["blocks"];
  blocks.sort((a, b) => a.id - b.id);

  const contestsStandingWithTrainees: TrainingFullDTO["standing"] = [];

  for (const entry of constestEntries) {
    const standings = entry.standing;
    if (!standings) continue;

    standings.forEach((standing) => {
      const { ContestInfo, rankings, problems } = standing;
      const rankingsWithTrainees = rankings
        .map((ranking) => {
          const user = traineesMap.get(ranking.userId);
          if (!user) {
            return undefined; // Skip if user not found
          }
          const { userId: __unneeded, ...rankingWithoutUserId } = ranking;
          return {
            ...user,
            ...rankingWithoutUserId,
          };
        })
        .filter((ranking) => ranking !== undefined);

      contestsStandingWithTrainees.push({
        problems,
        ContestInfo,
        rankings: rankingsWithTrainees,
      });
    });
  }

  // Return as a flat array of user standings (not contest standings)
  return { leaderBoard: leaderBoardWithTrainees, blocks, standing: contestsStandingWithTrainees, title };
}

const userSelectFields = {
  name: UsersFullData.firstNameEn,
  cfHandle: Users.cfHandle,
  vjudge: Users.vjHandle,
  gmail: Users.gmail,
  level: UsersFullData.academicYear,
  university: Institutes.name,
  faculty: Faculties.name,
};

function selectKeysFromObjects(data: typeof userSelectFields, keys: string[]) {
  return keys.reduce((acc, key) => {
    if (key in data) {
      // @ts-expect-error - This is a hack to get around the type system
      acc[key] = data[key];
    }
    return acc;
  }, {});
}
