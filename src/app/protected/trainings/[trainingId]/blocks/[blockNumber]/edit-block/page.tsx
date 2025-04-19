import TrainingBlockForm from "@/app/protected/trainings/[trainingId]/blocks/TrainingBlockForm";

export default async function Page({
  params,
}: {
  params: { trainingId: string; blockNumber: string };
}) {
  const { trainingId, blockNumber } = params;

  return (
    <div className="flex flex-col gap-4">
      <TrainingBlockForm params={{ trainingId, blockNumber }} />
    </div>
  );
}