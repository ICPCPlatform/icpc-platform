import ContestForm from '@/app/protected/trainings/[trainingId]/blocks/[blockNumber]/contests/[contestId]/edit-contest/ContestForm';


export default async function Page({ params }: { params: { trainingId: string; blockNumber: string; contestId: string; } }) {
  const { trainingId, blockNumber, contestId } = params;

  return (
    <div className="flex flex-col gap-4">
      <ContestForm params={{ trainingId, blockNumber, contestId }} />
    </div>
  );
}