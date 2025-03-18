"use client";

import { useTrainingContext } from "@/providers/training";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Clock, Users, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
export default function Page() {
  const data = useTrainingContext();
  const pathname = window.location.pathname;

  // Log the data structure to see what we're working with
  console.log("Training Context Data:", data);

  // Check if data and standing exist
  if (!data || !data.standing || data.standing.length === 0) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              No standings data available
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  const contestStanding = data.standing.find(
    (standing) =>
      standing.ContestInfo.id === Number(pathname.split("/").at(-2)),
  );
  if (!contestStanding) {
    return <div className="container py-8 px-4 md:px-6">
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            Contest standings not found
          </p>
        </CardContent>
      </Card>
    </div>;
  }

  // Get the first contest standing (assuming we're displaying one contest at a time)
  console.log("Contest Standing:", contestStanding);

  // Try to access the contest info with either property name
  const contestInfo =
    // @ts-expect-error - Handle property name mismatch between actual data and types
    contestStanding.ContestInfo;
  const { problems, rankings } = contestStanding;

  if (!contestInfo || !problems || !rankings) {
    return (
      <div className="container py-8 px-4 md:px-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">
              Invalid standings data format
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 md:px-6 space-y-6">
      {/* Contest Info Card */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">
            {contestInfo.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Start: {new Date(contestInfo.start_time).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Duration: {contestInfo.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Participants: {contestInfo.participant_count}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Problems: {contestInfo.problem_count}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standings Table */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Standings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="sticky left-0 bg-card px-4 py-3 text-left font-medium text-muted-foreground w-[80px]">
                    Rank
                  </th>
                  <th className="sticky left-[80px] bg-card px-4 py-3 text-left font-medium text-muted-foreground w-[160px]">
                    Handle
                  </th>
                  <th className="sticky left-[240px] bg-card px-4 py-3 text-center font-medium text-muted-foreground w-[80px]">
                    Solved
                  </th>
                  <th className="sticky left-[320px] bg-card px-4 py-3 text-center font-medium text-muted-foreground w-[80px]">
                    Penalty
                  </th>
                  {problems.map((problem, index) => {
                    const problemLetter = problem.split(".")[0];
                    return (
                      <th
                        key={index}
                        className="px-4 py-3 text-center font-medium text-muted-foreground min-w-[60px] whitespace-nowrap"
                      >
                        {problemLetter}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rankings.map((ranking, index) => {
                  const rank = index + 1;
                  const solvedCount = ranking.solved.length;
                  const isTopRank = rank <= 3;

                  return (
                    <tr
                      key={index}
                      className={cn(
                        "border-b",
                        rank === 1 && "bg-amber-500/10",
                        rank === 2 && "bg-slate-400/10",
                        rank === 3 && "bg-amber-700/10",
                      )}
                    >
                      <td className="sticky left-0 bg-inherit px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          {rank === 1 && (
                            <Trophy className="h-5 w-5 text-amber-500" />
                          )}
                          {rank === 2 && (
                            <Medal className="h-5 w-5 text-slate-400" />
                          )}
                          {rank === 3 && (
                            <Medal className="h-5 w-5 text-amber-700" />
                          )}
                          <span>{rank}</span>
                        </div>
                      </td>
                      <td className="sticky left-[80px] bg-inherit px-4 py-3 font-medium">
                        {ranking.cfHandle || "Anonymous"}
                      </td>
                      <td className="sticky left-[240px] bg-inherit px-4 py-3 text-center">
                        <Badge
                          variant={isTopRank ? "default" : "outline"}
                          className="min-w-[28px]"
                        >
                          {solvedCount}
                        </Badge>
                      </td>
                      <td className="sticky left-[320px] bg-inherit px-4 py-3 text-center">
                        {ranking.penalty}
                      </td>
                      {problems.map((problem, problemIndex) => {
                        const problemLetter = problem.split(".")[0];
                        const isSolved = ranking.solved.includes(problemLetter);
                        const isAttempted =
                          ranking.attempted.includes(problemLetter);

                        return (
                          <td
                            key={problemIndex}
                            className={cn(
                              "px-4 py-3 text-center",
                              isSolved && "bg-green-800/20",
                              !isSolved && isAttempted && "bg-red-800/20",
                            )}
                          >
                            {isSolved ? problemLetter : isAttempted ? "✗" : ""}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
