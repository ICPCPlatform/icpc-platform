import { getTrainingFullData } from "@/actions/getTrainingFullData";
import TrainingProvider from "@/providers/training";

export default async function Layout({
  children,
  params,
}: {
  params: Promise<{ trainingId: string }>;
  children: React.ReactNode;
}) {
  const trainingId = Number(decodeURIComponent((await params).trainingId));

  const trainingData = await getTrainingFullData({ trainingId });
  console.log(trainingData);

  return (
    <TrainingProvider trainingData={trainingData}>{children}</TrainingProvider>
  );
}
