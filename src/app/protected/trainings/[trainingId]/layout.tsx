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
    <div className="mx-auto p-2 md:py-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-max max-w-full ">
        <TrainingProvider trainingData={trainingData}>
          <NoSSR>
            <TrainingNavigation trainingId={trainingId} />
            {children}
          </NoSSR>
        </TrainingProvider>
      </div>
    </div>
  );
}
