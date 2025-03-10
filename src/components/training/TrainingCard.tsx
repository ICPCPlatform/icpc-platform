"use client";

import { Training, UserTraining } from "@/lib/types/training";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, Users } from "lucide-react";

interface TrainingCardProps {
  training: Training | UserTraining;
  isUserTraining?: boolean;
  onEnroll?: (trainingId: string) => void;
}

export function TrainingCard({
  training,
  isUserTraining,
  onEnroll,
}: TrainingCardProps) {
  const isUserTrainingType = (
    training: Training | UserTraining,
  ): training is UserTraining => {
    return "progress" in training;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLevelColor = (level: Training["level"]) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/10 text-green-500";
      case "intermediate":
        return "bg-blue-500/10 text-blue-500";
      case "advanced":
        return "bg-purple-500/10 text-purple-500";
    }
  };

  const getStatusColor = (status: Training["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-yellow-500/10 text-yellow-500";
      case "ongoing":
        return "bg-green-500/10 text-green-500";
      case "completed":
        return "bg-blue-500/10 text-blue-500";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle className="text-xl">{training.title}</CardTitle>
            <CardDescription className="mt-2">
              {training.description}
            </CardDescription>
          </div>
          <Badge variant="secondary" className={getLevelColor(training.level)}>
            {training.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>
                {formatDate(training.startDate)} -{" "}
                {formatDate(training.endDate)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {training.enrolled}/{training.capacity}
              </span>
            </div>
          </div>

          {isUserTrainingType(training) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{training.progress}%</span>
              </div>
              <Progress value={training.progress} className="h-2" />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {training.topics.map((topic, index) => (
              <Badge key={index} variant="outline" className="bg-muted/50">
                {topic}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <Badge className={getStatusColor(training.status)}>
              {training.status}
            </Badge>
            {!isUserTraining && training.enrollmentStatus === "open" && (
              <Button
                onClick={() => onEnroll?.(training.id)}
                className="ml-auto"
              >
                Apply Now
              </Button>
            )}
            {isUserTraining && <Button variant="outline">View Training</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
