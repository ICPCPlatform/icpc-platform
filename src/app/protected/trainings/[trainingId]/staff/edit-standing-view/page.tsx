import EditStandingViewForm from "./EditStandingViewForm";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { Trainings } from "@/lib/db/schema/training/Trainings";

export default async function EditStandingViewPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;
  const trainingIdNumber = Number(trainingId);
  const initial = (
    await db
      .select({ standingView: Trainings.standingView })
      .from(Trainings)
      .where(eq(Trainings.trainingId, trainingIdNumber))
  ).at(0)?.standingView;

  if (initial === undefined) {
    console.error(`Training not found or standing view not set ${trainingId} edit sanding view`);
    throw new Error("Training not found or standing view not set");
  }

  return (
    <EditStandingViewForm initial={initial} trainingId={trainingIdNumber} />
  );
}
