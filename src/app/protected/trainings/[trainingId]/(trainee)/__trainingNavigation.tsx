"use client";

<<<<<<< feature/trainings-leaderboard
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
=======
import { useTrainingContext } from "@/providers/training";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy } from "lucide-react";
>>>>>>> development

// Type for contest standing data
interface ContestStanding {
  ContestInfo: {
    id: number;
    title: string;
  };
}

// Extended training context type that might include standing
interface ExtendedTrainingContext {
  leaderboard: unknown[];
  blocks: unknown[];
  standing?: ContestStanding[];
}

export default function TrainingNavigation({
  trainingId,
}: {
  trainingId: number;
}) {
<<<<<<< feature/trainings-leaderboard
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
=======
  const training = useTrainingContext() as ExtendedTrainingContext | null;

  return (
    <div className="flex gap-6">
      <aside>
        <Card className="flex-shrink-0 w-64">
          <CardHeader>
            <CardTitle className="text-lg">Training Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {/* Contest standings section - only show if standing data exists */}
              {training?.standing && Array.isArray(training.standing) && training.standing.length > 0 && (
                <>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Contest Standings
                  </div>
                  {training.standing.map((context: ContestStanding, i: number) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link
                        href={`/protected/trainings/${trainingId}/contests/${context.ContestInfo.id}/standing`}
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        {context.ContestInfo.title}
                      </Link>
                    </Button>
                  ))}
                </>
              )}
              
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href={`/protected/trainings/${trainingId}/materials`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Materials
                  </Link>
                </Button>
              </div>
            </nav>
          </CardContent>
        </Card>
>>>>>>> development
      </aside>
    </div>
  );
}
