import { getTrainingFullData } from "@/dao/getTrainingFullData";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Trophy, Bell } from "lucide-react";
import { TypographyH1 } from "@/components/ui/typography";

export default async function TrainingOverviewPage({ params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  const trainingIdNumber = Number(trainingId);
  const trainingData = await getTrainingFullData({ trainingId: trainingIdNumber });

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Announcements
            </CardTitle>
            <CardDescription>
              Important updates and news about this training
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No announcements yet.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later for updates
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">View Materials</p>
                  <p className="text-sm text-muted-foreground">Access training resources</p>
                </div>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Join Contests</p>
                  <p className="text-sm text-muted-foreground">Participate in competitions</p>
                </div>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">Check Leaderboard</p>
                  <p className="text-sm text-muted-foreground">See your ranking</p>
                </div>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
