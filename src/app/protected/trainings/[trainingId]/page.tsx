"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Trophy } from "lucide-react";
import { TypographyH1 } from "@/components/ui/typography";
import { useTrainingContext } from "@/providers/training";
import { useParams } from "next/navigation";

export default function TrainingOverviewPage() {
  const { trainingId } =  useParams();
  const trainingData = useTrainingContext();
  if(!trainingId || isNaN(Number(trainingId))) {
    return <div>Invalid training ID</div>;
  }
  const trainingIdNumber = Number(trainingId);
  if (!trainingData) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TypographyH1 className="text-3xl font-bold tracking-tight">Training Overview</TypographyH1>
          <p className="text-muted-foreground">Welcome to your training hub! Here you can find announcements, a summary, and quick links to all sections.</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Training #{trainingIdNumber}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Blocks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingData.blocks.length}</div>
            <p className="text-xs text-muted-foreground">
              Total blocks in this training
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainingData.leaderBoard.length}</div>
            <p className="text-xs text-muted-foreground">
              Active participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contests</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* TODO: Add contest count when contests data is available */}
              0
            </div>
            <p className="text-xs text-muted-foreground">
              Total contests available
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <a href={`/protected/trainings/${trainingIdNumber}/materials`}>
                <button className="flex items-center gap-2 w-full px-4 py-2 rounded border hover:bg-muted transition">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Materials</span>
                </button>
              </a>
              <a href={`/protected/trainings/${trainingIdNumber}/contests`}>
                <button className="flex items-center gap-2 w-full px-4 py-2 rounded border hover:bg-muted transition">
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Contests</span>
                </button>
              </a>
              <a href={`/protected/trainings/${trainingIdNumber}/leaderboard`}>
                <button className="flex items-center gap-2 w-full px-4 py-2 rounded border hover:bg-muted transition">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Leaderboard</span>
                </button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
