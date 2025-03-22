import { db } from "@/lib/db";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { UserDataJWT } from "@/lib/session";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export default async function Page() {
  const userData = JSON.parse(
    (await headers()).get("x-user") ?? "",
  ) as UserDataJWT;

  const trainingData = await db
    .select({
      trainingId: Trainings.trainingId,
      title: Trainings.title,
      status: Trainings.status,
    })
    .from(Trainings)
    .innerJoin(Trainees, eq(Trainings.trainingId, Trainees.trainingId))
    .where(eq(Trainees.userId, userData.userId))
    .execute();

  return (
    <>
      <h1>My Trainings</h1>
      <pre>{JSON.stringify(trainingData, null, 2)}</pre>
    </>
  );
}
