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
import { Staff } from "@/lib/db/schema/training/Staff";
import {
  Trainee,
  TrainingFullDTO,
  LeaderBoardEntry,
} from "@/lib/types/training";
import { Contests } from "@/lib/db/schema/training/Contests";

export async function getTrainingFullData({
  trainingId,
  userId,
}: {
  trainingId: number;
  userId?: string;
}): Promise<TrainingFullDTO & { userRoles?: string[] }> {
  // Fetch training details
  const trainingResult = await db
    .select({
      leaderBoard: Trainings.leaderBoard,
      standingView: Trainings.standingView,
      headId: Trainings.headId,
      chiefJudge: Trainings.chiefJudge,
    })
    .from(Trainings)
    .where(eq(Trainings.trainingId, trainingId))
    .execute();

  const training = trainingResult[0];
  if (!training) {
    throw new Error("Training not found");
  }

  const { standingView, leaderBoard, headId, chiefJudge } = training;
  // leaderBoard is expected to be an array of { userId, points }
  const leaderBoardEntry: LeaderBoardEntry[] = Array.isArray(leaderBoard)
    ? leaderBoard
    : [];

  // Get all userIds in the leaderboard
  const traineeIds = leaderBoardEntry
    .map((entry) => entry.userId)
    .filter((id) => id !== undefined);

  // Fetch user details for each userId
  const trainees: Trainee[] = (await db
    .select({
      ...selectKeysFromObjects(userSelectFields, standingView),
      userId: Users.userId,
    })
    .from(Users)
    .leftJoin(UsersFullData, eq(UsersFullData.userId, Users.userId))
    .leftJoin(Institutes, eq(Institutes.id, UsersFullData.instituteId))
    .leftJoin(Faculties, eq(Faculties.id, UsersFullData.facultyId))
    .where(inArray(Users.userId, traineeIds))
    .execute()) satisfies Trainee[];

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

  // Fetch blocks as before
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

  const blocks = blocksResult satisfies TrainingFullDTO["blocks"];
  blocks.sort((a, b) => a.id - b.id);

  const constestEntries = await db
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
          blocks.map((x) => x.id),
        ),
      ),
    );
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
  // If userId is provided, fetch staff row and check head/chief judge
  let userRoles: string[] | undefined = undefined;
  if (userId) {
    userRoles = [];
    // Check staff table
    const staffRows = await db
      .select({
        mentor: Staff.mentor,
        problemSetter: Staff.problemSetter,
        instructor: Staff.instructor,
        coHead: Staff.coHead,
        manager: Staff.manager,
      })
      .from(Staff)
      .where(
        and(
          eq(Staff.userId, userId),
          eq(Staff.trainingId, trainingId),
          isNull(Staff.deleted),
        ),
      )
      .execute();
    if (staffRows.length > 0) {
      const staff = staffRows[0];
      if (staff.mentor) userRoles.push("mentor");
      if (staff.problemSetter) userRoles.push("problem_setter");
      if (staff.instructor) userRoles.push("instructor");
      if (staff.coHead) userRoles.push("co_head");
      if (staff.manager) userRoles.push("manager");
    }
    // Check head_id and chief_judge
    if (userId === headId) userRoles.push("head");
    if (userId === chiefJudge) userRoles.push("chief_judge");
  }

  // Return as a flat array of user standings (not contest standings)
  return { leaderBoard: leaderBoardWithTrainees, blocks, standing: contestsStandingWithTrainees, userRoles };
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
