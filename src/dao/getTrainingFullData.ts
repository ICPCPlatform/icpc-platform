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
import { Staff } from "@/lib/db/schema/training/Staff";
import {
  Trainee,
  TrainingFullDTO,
  LeaderBoardEntry,
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

export type TrainingFlatLeaderboardDTO = {
  standing: (Trainee & LeaderBoardEntry)[];
  blocks: TrainingFullDTO["blocks"];
};

export async function getTrainingFullData({
  trainingId,
  userId,
}: {
  trainingId: number;
  userId?: string;
}): Promise<TrainingFlatLeaderboardDTO & { userRoles?: string[] }> {
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
  const standing: LeaderBoardEntry[] = Array.isArray(leaderBoard) ? leaderBoard : [];

  // Get all userIds in the leaderboard
  const traineeIds = standing.map((entry) => entry.userId).filter((id) => id !== undefined);

  // Fetch user details for each userId
  const trainees: Trainee[] = (await db
    .select({ ...selectKeysFromObjects(userSelectFields, standingView), userId: Users.userId })
    .from(Users)
    .leftJoin(UsersFullData, eq(UsersFullData.userId, Users.userId))
    .leftJoin(Institutes, eq(Institutes.id, UsersFullData.instituteId))
    .leftJoin(Faculties, eq(Faculties.id, UsersFullData.facultyId))
    .where(inArray(Users.userId, traineeIds))
    .execute()) satisfies Trainee[];

  // Merge leaderboard points with user details
  const standingWithDetails = standing.map((entry) => {
    const user = trainees.find((usr) => usr.userId === entry.userId);
    return {
      ...user,
      points: entry.points,
      userId: entry.userId,
    };
  });

  // Fetch blocks as before
  const blocksResult = await db
    .select({ id: Blocks.blockNumber, title: Blocks.title, materials: Blocks.material, description: Blocks.description })
    .from(Blocks)
    .where(and(eq(Blocks.trainingId, trainingId), eq(Blocks.hidden, false), isNull(Blocks.deleted)))
    .execute();

  const blocks = blocksResult satisfies TrainingFullDTO["blocks"];
  blocks.sort((a, b) => a.id - b.id);

  // If userId is provided, fetch staff row and check head/chief judge
  let userRoles: string[] | undefined = undefined;
  if (userId) {
    userRoles = [];
    // Check staff table
    const staffRows = await db
      .select({ mentor: Staff.mentor, problemSetter: Staff.problemSetter, instructor: Staff.instructor, coHead: Staff.coHead, manager: Staff.manager })
      .from(Staff)
      .where(and(eq(Staff.userId, userId), eq(Staff.trainingId, trainingId), isNull(Staff.deleted)))
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
  return { standing: standingWithDetails, blocks, ...(userRoles ? { userRoles } : {}) };
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
