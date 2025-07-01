"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrainingContext } from "@/providers/training";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const trainingData = useTrainingContext();

  const trainingId = useParams().trainingId;
  if (!trainingData) {
    return <div>Loading...</div>;
  }
  if (!trainingId || isNaN(Number(trainingId))) {
    return <div>Invalid training ID</div>;
  }

  return (
    <div className="container mx-auto py-6 grid grid-cols-8 gap-6 max-h-screen">
      <TrainingNavigation
        trainingData={trainingData}
        trainingId={trainingId}
        className="col-span-2"
      />

      <main className="col-span-6">{children}</main>
    </div>
  );
}

function TrainingNavigation({
  trainingData,
  trainingId,
  className = "",
}: {
  trainingData: ReturnType<typeof useTrainingContext>;
  trainingId: string | string[];
  className?: string;
}) {
  if (!trainingData) {
    return <div>Loading...</div>;
  }
  const hasContests = Array.isArray(trainingData.standing) && trainingData.standing.length > 0;
  if (!hasContests) {
    return null;
  }
  return (
    <div className={`flex gap-6 ${className}`}>
      <aside>
        <Card className="flex-shrink-0 w-64">
          <CardHeader>
            <CardTitle className="text-lg">Training Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2 gap-2 flex flex-col">
              {/* Only show Contest Standings if there are contests */}
              <>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Contest Standings
                </div>
                {trainingData.standing?.map((context, i: number) =>
                  context.contestInfo ? (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link
                        href={`/protected/trainings/${trainingId}/contests/${context.contestInfo.id}/standing`}
                        className="flex items-start break-words whitespace-normal w-full h-fit min-h-[2.1rem] pb-2 pt-2"
                      >
                        <Trophy className="h-4 w-4 mr-2 shrink-0" />
                        <span className="break-words whitespace-normal">
                          {context.contestInfo.title}
                        </span>
                      </Link>
                    </Button>
                  ) : null,
                )}
              </>
            </nav>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
