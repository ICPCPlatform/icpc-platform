"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";



const itemStyle = "w-full gap-3   text-sm font-medium rounded-md transition-colors whitespace-nowrap hover:bg-accent hover:text-accent-foreground my-2 box-border"
export default function TrainingNavigation({
  trainingId,
}: {
  trainingId: number;
}) {
  // const training = useTrainingContext(); // Remove unused variable
  const pathname = usePathname();
  // If on leaderboard page, do not render the sidebar at all
  if (pathname.includes("/leaderboard")) {
    return null;
  }
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
          >
            <ul className={cn("flex", "flex-col")}> 
              <li className={cn(itemStyle, "bg-zinc-500")}
              >
                <Link href={`/protected/trainings/${trainingId}/materials`} className={cn("w-full block box-border px-4 py-2")}>
                  materials
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
}
