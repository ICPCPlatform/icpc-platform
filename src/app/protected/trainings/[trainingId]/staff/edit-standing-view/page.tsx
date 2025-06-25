import { getTrainingFullData } from "@/dao/getTrainingFullData";
import EditStandingViewForm from "./EditStandingViewForm";

export default async function EditStandingViewPage({ params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  const trainingIdNumber = Number(trainingId);
  const trainingData = await getTrainingFullData({ trainingId: trainingIdNumber });
  const initial = trainingData.standingView || [];
  return <EditStandingViewForm initial={initial} trainingId={trainingIdNumber} />;
}
