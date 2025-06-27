import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { getUserData } from "@/lib/session";
import { eq, isNull } from "drizzle-orm";
import TrainingsTabs from "./TrainingsTabs";

export default async function TrainingsPage() {
  const userData = await getUserData();
  const isAdminOrStaff = userData && (userData.role === 'admin' );

  // My trainings
  let myTrainings = [];
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
  let allTrainings = [];
  if (isAdminOrStaff) {
    allTrainings = await db
      .select({
        id: Trainings.trainingId,
        title: Trainings.title,
        description: Trainings.description,
        startDate: Trainings.startDate,
        duration: Trainings.duration,
        status: Trainings.status,
      })
      .from(Trainings)
      .where(isNull(Trainings.deleted))
      .execute();
  } else {
    allTrainings = await db
      .select({
        id: Trainings.trainingId,
        title: Trainings.title,
        description: Trainings.description,
        startDate: Trainings.startDate,
        duration: Trainings.duration,
        status: Trainings.status,
      })
      .from(Trainings)
      .where(isNull(Trainings.deleted))
      .where(eq(Trainings.status, 'active'))
      .execute();
  }

  // Get enrolled training IDs for the user
  const enrolledIds = myTrainings.map((t: any) => t.trainingId);

  return (
    <TrainingsTabs
      myTrainings={myTrainings}
      allTrainings={allTrainings}
      isAdminOrStaff={isAdminOrStaff}
      enrolledIds={enrolledIds}
    />
  );
}
