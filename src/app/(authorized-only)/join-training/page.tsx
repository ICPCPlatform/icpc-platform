"use server";
import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { eq } from "drizzle-orm";
// import type { Metadata } from "next";
import TrainingComp from "./_trainingComp";

// export const metadata: Metadata = {
//   title: "Wow you are really interested in training",
//   description: "A platform for managing ICPC-style programming competitions",
// };

export default async function Page() {
  const trainings = (await db
    .select({
      id: Trainings.trainingId,
      title: Trainings.title,
      description: Trainings.description,
      startDate: Trainings.startDate,
      duration: Trainings.duration,
    })
    .from(Trainings)
    .where(eq(Trainings.status, "active"))
    .execute()) satisfies Array<TrainingType>;
  return (
    <>
      <h1> Training </h1>
      {trainings.map((training) => (
        <TrainingComp training={training} key={training.title} />
      ))}
    </>
  );
}

export type TrainingType = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  duration: number | null;
};
