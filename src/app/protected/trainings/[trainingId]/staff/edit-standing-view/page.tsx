import { getTrainingFullData } from "@/dao/getTrainingFullData";
import EditStandingViewForm from "./EditStandingViewForm";

export default async function EditStandingViewPage({ params }: { params: { trainingId: string } }) {
  const trainingId = Number(params.trainingId);
  const trainingData = await getTrainingFullData({ trainingId });
  const initial = trainingData.standingView || [];
  return <EditStandingViewForm initial={initial} trainingId={trainingId} />;
}
