"use client";
import { useTrainingContext } from "@/providers/training";

export default function Page() {
  const training = useTrainingContext();
  const materials = training?.blocks?.find(
    (block) => block.id === 1,
  )?.materials;
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Materials</h1>
      <div className="flex flex-col gap-2">
        {materials?.map((material, idx) => (
          <div key={idx} className="p-4 border rounded-md">
            <h2 className="text-xl font-semibold">{material.title}</h2>
            <p>{material.des}</p>
            <a href={material.link} className="text-blue-500 underline">
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
