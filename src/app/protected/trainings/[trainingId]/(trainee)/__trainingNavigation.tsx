"use client";

import { cn } from "@/lib/utils";
import { useTrainingContext } from "@/providers/training";
import Link from "next/link";



const itemStyle = "w-full gap-3   text-sm font-medium rounded-md transition-colors whitespace-nowrap hover:bg-accent hover:text-accent-foreground my-2 box-border"
export default function TrainingNavigation({
  trainingId,
}: {
  trainingId: number;
}) {
  const training = useTrainingContext();
  console.log(training);
  return (
    <div className="flex gap-6">
      <aside>
        <div className="flex-shrink-0 w-64 bg-card rounded-lg border p-4">
          <nav
            className={cn(
              "rounded-lg",
              "overflow-hidden",
              "h-auto",
              "self-center",
            )}
            // style={{ backgroundColor: "rgb(41, 41, 41)" }}
          >
            <ul className={cn("flex", "flex-col")}>
            {(training?.standing) &&
            <>
              {training?.standing.map((context, i) => (
                <li
                key={i}
                className={cn(itemStyle,"bg-slate-400")}
                >
                  <Link
                    href={`/protected/trainings/${trainingId}/contests/${context.ContestInfo.id}/standing`}
                    className={cn("w-full block box-border px-4 py-2")}
                    >
                    contest: {context.ContestInfo.title}
                  </Link>
                </li>
              ))}
              </>
            }
              <li
                className={cn(itemStyle,
                   "bg-zinc-500"
                )}
              >
                <Link href={`/protected/trainings/${trainingId}/materials`} className={cn("w-full block box-border px-4 py-2")}>
                  materials
                </Link>
              </li>
              <li>

              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
