"use client";
import { useTrainingContext } from "@/providers/training";

export default function Page() {
  const training = useTrainingContext();
  return (
    <div>
      <pre>{JSON.stringify(training?.materials, null, 2)}</pre>
    </div>
  );

}
