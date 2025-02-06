import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import TrainingComp from "./_trainingComp";
import styles from "./training.module.css";

export const metadata: Metadata = {
  title: "Available Trainings | ICPC Platform",
  description: "Browse and join upcoming ICPC-style programming training sessions",
};

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
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Available Trainings</h1>
          <p className={styles.pageDescription}>
            Join our ICPC-style programming training sessions to enhance your competitive programming skills
          </p>
        </div>

        <div className={styles.trainingsGrid}>
          {trainings.map((training) => (
            <TrainingComp training={training} key={training.id} />
          ))}
        </div>

        {trainings.length === 0 && (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyStateTitle}>No Active Trainings</h3>
            <p className={styles.emptyStateText}>
              There are no training sessions available at the moment. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export type TrainingType = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  duration: number | null;
};
