"use client";

import { cn } from "@/lib/utils";
import { useTrainingContext } from "@/providers/training";
import Link from "next/link";

export default function TrainingNavigation({
  trainingId,
}: {
  trainingId: number;
}) {
  const training = useTrainingContext();
  console.log(training);
  return (
    <nav
      className={cn(
        "rounded-lg",
        "overflow-hidden",
        "h-auto",
        "self-center",
        "my-10",
        "mx-20"
      )}
      style={{ backgroundColor: "rgb(41, 41, 41)" }}
    >
      <ul className={cn("flex", "flex-col")}>
        {training?.standing.map((context, i) => (
          <li
            key={i}
            className={cn("p-5")}
          >
            <Link
              href={`/protected/trainings/${trainingId}/contests/${context.ContestInfo.id}/standing`}
            >
              {context.ContestInfo.title}
            </Link>
          </li>
        ))}
        <li className={cn("p-5", "bg-gray-500")}>
          <Link href={`/protected/trainings/${trainingId}/material`}>
            material
          </Link>
        </li>
      </ul>
    </nav>
  );
}
