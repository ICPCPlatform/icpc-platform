"use client";
import { useTrainingContext } from "@/providers/training";

export default function Page() {
  const training = useTrainingContext();
  return (
    <div>
      <pre>{JSON.stringify(training?.material, null, 2)}</pre>
    </div>
  );

}
