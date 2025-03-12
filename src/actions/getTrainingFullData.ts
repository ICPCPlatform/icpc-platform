"use server";

import "server-only";
import { unstable_cache } from 'next/cache';
import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { Contests } from "@/lib/db/schema/training/Contests";
import { Users } from "@/lib/db/schema/user/Users";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { Institutes } from "@/lib/db/schema/user/Institutes";
import { Faculties } from "@/lib/db/schema/user/Faculties";
import { eq } from "drizzle-orm";
import { inArray } from "drizzle-orm/sql/expressions/conditions";

// Simple debug counter for database fetches
let fetchCount = 0;

// Define the type for training data
export type TrainingData = {
  trainingId: number;
  standing: Record<string, {
    standing: Array<{
      userId: string;
      penalty: number;
      solved: string[];
      attempted: string[];
    }>;
    problems: string[];
  }>;
  standingView: string[];
  contests: Record<string, {
    title: string;
    description: string;
    type: string;
    trainingId: number;
  }>;
  trainees: Record<string, {
    name?: string | null;
    cfHandle?: string;
    vjudge?: string | null;
    gmail?: string;
    level?: number;
    university?: string;
    faculty?: string;
  }>;
};

const ___ = {
  userId: Users.userId,
  name: UsersFullData.firstNameEn,
  cfHandle: Users.cfHandle,
  vjudge: Users.vjHandle,
  gmail: Users.gmail,
  level: UsersFullData.academicYear,
  university: Institutes.name,
  faculty: Faculties.name
};

const selectKeysFromObjects = (data: typeof ___, keys: string[]) => {
  return keys.reduce((acc, key) => {
      if (key in data) {
          // @ts-expect-error - This is a hack to get around the type system
          acc[key] = data[key];
      }
      return acc;
  }, {});
};

// Base function that fetches data from database
async function fetchTrainingData(
  trainingId: number
): Promise<TrainingData | null> {
  try {
    // Only log when we actually fetch from database
    fetchCount++;
    console.log(`🔴 DB Fetch #${fetchCount} - Training ${trainingId}`);
    
    // Fetch training base data
    const trainingResult = await db
      .select({
        trainingId: Trainings.trainingId,
        standing: Trainings.standing,
        standingView: Trainings.standingView,
      })
      .from(Trainings)
      .where(eq(Trainings.trainingId, trainingId))
      .execute();

    if (trainingResult.length === 0) {
      return null;
    }

    const training = trainingResult[0] as TrainingData;

    // Fetch all contests for this training
    const contestsResult = await db
      .select({
        contestId: Contests.contestId,
        title: Contests.title,
        description: Contests.description,
        type: Contests.type,
        trainingId: Contests.trainingId,
      })
      .from(Contests)
      .where(eq(Contests.trainingId, trainingId))
      .execute();

    // Convert contests array to record
    const contests = contestsResult.reduce((acc, contest) => {
      acc[contest.contestId] = {
        title: contest.title,
        description: contest.description,
        type: contest.type,
        trainingId: contest.trainingId,
      };
      return acc;
    }, {} as TrainingData['contests']);

    // Get all unique trainee IDs from all standings
    const traineeIds = new Set<string>();
    Object.values(training.standing).forEach(contestStanding => {
      contestStanding.standing.forEach(entry => {
        traineeIds.add(entry.userId);
      });
    });

    // Fetch trainee details
    const traineeArray = await db
      .select(selectKeysFromObjects(___, [...training.standingView, 'userId']))
      .from(Users)
      .leftJoin(UsersFullData, eq(UsersFullData.userId, Users.userId))
      .leftJoin(Institutes, eq(Institutes.id, UsersFullData.instituteId))
      .leftJoin(Faculties, eq(Faculties.id, UsersFullData.facultyId))
      .where(inArray(Users.userId, Array.from(traineeIds)))
      .execute();

    // Convert trainees array to record
    type TraineeRecord = {
      userId: string;
      name?: string | null;
      cfHandle?: string;
      vjudge?: string | null;
      gmail?: string;
      level?: number;
      university?: string;
      faculty?: string;
    };
    
    const trainees = traineeArray.reduce((acc, trainee) => {
      const { userId, ...traineeData } = trainee as TraineeRecord;
      if (userId) {
        acc[userId] = traineeData;
      }
      return acc;
    }, {} as TrainingData['trainees']);

    return {
      ...training,
      contests,
      trainees,
    };
  } catch (error) {
    console.error("Error fetching training data:", error);
    return null;
  }
}

// Cached version using Next.js cache
export const getTrainingFullData = unstable_cache(
  async (trainingId: number) => {
    return fetchTrainingData(trainingId);
  },
  ['training-data'], // cache tag
  {
    revalidate: 60, // Cache for 60 seconds
    tags: ['training-data']
  }
);

