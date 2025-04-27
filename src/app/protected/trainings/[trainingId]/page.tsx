"use client";

import { use } from "react";
import NoSSR from "@/components/util/NoSSR";
import TrainingNavigation from "./__trainingNavigation";
import { useTrainingContext } from "@/providers/training";

export default function Page({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = use(params); // unwrap the promise using React.use()

  const training = useTrainingContext();
  const decodedTrainingId = Number(decodeURIComponent(trainingId));

  return (
    <div className="mx-auto p-2 md:py-6">
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6 w-max max-w-full ">
        <NoSSR>
          <TrainingNavigation trainingId={decodedTrainingId} />
        </NoSSR>
        <div className="w-full lg:flex-[3]">
          <h1 className="text-2xl font-bold mb-4">Training Details</h1>
          <pre>{JSON.stringify(training, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
