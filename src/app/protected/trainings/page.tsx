import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { getUserData } from "@/lib/session";
import {  eq, isNull, and, or, desc, isNotNull} from "drizzle-orm";
import TrainingsTabs from "./TrainingsTabs";
import { Staff } from "@/lib/db/schema/training/Staff";

export default async function TrainingsPage() {
  const userData = await getUserData();
  if (!userData) {
    return (
      <div className="text-center text-2xl">
        Please log in to view trainings.
      </div>
    );
  }
  const isAdminOrStaff = userData && userData.role === "admin";

  // My trainings
  let myTrainings: {
    trainingId: number;
    title: string;
    description: string;
    startDate: string;
    duration: number;
    status: string;
  }[] = [];

  if (userData) {
    myTrainings = await db
      .select({
        trainingId: Trainings.trainingId,
        title: Trainings.title,
        description: Trainings.description,
        startDate: Trainings.startDate,
        duration: Trainings.duration,
        status: Trainings.status,
      })
      .from(Trainings)
      .innerJoin(Trainees, eq(Trainings.trainingId, Trainees.trainingId))
      .where(eq(Trainees.userId, userData.userId))
      .execute();
  }

  // All trainings
  let allTrainings: {
    trainingId: number;
    title: string;
    description: string;
    startDate: string;
    duration: number;
    status: string;
  }[] = [];

  if (isAdminOrStaff) {
    allTrainings = await db
      .select({
        trainingId: Trainings.trainingId,
        title: Trainings.title,
        description: Trainings.description,
        startDate: Trainings.startDate,
        duration: Trainings.duration,
        status: Trainings.status,
      })
      .from(Trainings)
      .orderBy(desc(Trainings.startDate))
      .limit(20)
      .execute();
  } else {
    allTrainings = await db
      .select({
        trainingId: Trainings.trainingId,
        title: Trainings.title,
        description: Trainings.description,
        startDate: Trainings.startDate,
        duration: Trainings.duration,
        status: Trainings.status,
        isStaff: isNotNull(Staff.userId),
      })
      .from(Trainings)
      .where(
        or(
          eq(Trainings.headId, userData.userId),
          eq(Trainings.chiefJudge, userData.userId),
          and(isNull(Trainings.deleted), eq(Trainings.status, "active")),
          eq(Staff.userId, userData.userId),
        ),
      )
      .leftJoin(
        Staff,
        and(
          eq(Staff.trainingId, Trainings.trainingId),
          eq(Staff.userId, userData.userId),
          isNull(Staff.deleted),
        ),
      )
      .orderBy(desc(Trainings.startDate))
      .limit(10)
      .execute();
  }

  // Get enrolled training IDs for the user
  const enrolledIds = myTrainings.map((t) => t.trainingId);

  return (
    <TrainingsTabs
      myTrainings={myTrainings}
      allTrainings={allTrainings}
      isAdminOrStaff={isAdminOrStaff || false}
      enrolledIds={enrolledIds}
    />
  );
}
