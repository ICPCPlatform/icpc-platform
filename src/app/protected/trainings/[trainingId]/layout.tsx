import { getTrainingFullData } from "@/actions/getTrainingFullData";
import TrainingProvider from "@/providers/training";
import NoSSR from "@/components/util/NoSSR";
import TrainingNavigation from "./__trainingNavigation";
import { cn } from "@/lib/utils";

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

    <div className={cn('w-max','flex','flex-row')}>
      <TrainingProvider trainingData={trainingData}>
        <TrainingNavigation trainingId={trainingId} />
        <div>
        <NoSSR>{children}</NoSSR>
        </div>
      </TrainingProvider>
    </div>
  );
}
