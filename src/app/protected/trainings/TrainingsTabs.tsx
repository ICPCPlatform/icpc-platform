"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-500 hover:bg-green-600";
    case "roadmap":
      return "bg-blue-500 hover:bg-blue-600";
    case "private":
      return "bg-purple-500 hover:bg-purple-600";
    case "over":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}

interface Training {
  id?: number;
  trainingId?: number;
  title: string;
  description: string;
  startDate: string;
  duration: number | null;
  status?: string;
  headId?: number;
  chiefJudge?: number;
  standingView?: string[];
}

interface TrainingsTabsProps {
  myTrainings: Training[];
  allTrainings: Training[];
  isAdminOrStaff: boolean;
  enrolledIds: number[];
}

export default function TrainingsTabs({ myTrainings, allTrainings, isAdminOrStaff, enrolledIds }: TrainingsTabsProps) {
  const [tab, setTab] = useState<'all' | 'my'>('all');
  const [modalTraining, setModalTraining] = useState<Training | null>(null);

  const renderDetailsModal = () => {
    if (!modalTraining) return null;
    const statusText = modalTraining.status ? modalTraining.status.charAt(0).toUpperCase() + modalTraining.status.slice(1) : 'Unknown';
    // For now, show headId and chiefJudge as IDs (username fetch can be added later)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative border border-zinc-200 dark:border-zinc-700">
          <button
            className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
            onClick={() => setModalTraining(null)}
            aria-label="Close"
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">{modalTraining.title}</h2>
          <div className="mb-2">
            <Badge className={getStatusColor(modalTraining.status ?? '')}>{statusText}</Badge>
          </div>
          <div className="mb-2 text-muted-foreground">
            <span className="font-medium">Start:</span> {formatDate(modalTraining.startDate)}
            {modalTraining.duration && <span> • <span className="font-medium">Duration:</span> {modalTraining.duration} days</span>}
          </div>
          <div className="mb-4">
            <p className="text-zinc-800 dark:text-zinc-200 whitespace-pre-line">{modalTraining.description}</p>
          </div>
          {modalTraining.headId && (
            <div className="mb-1 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-medium">Head:</span> <span className="font-mono">{modalTraining.headId}</span>
            </div>
          )}
          {modalTraining.chiefJudge && (
            <div className="mb-1 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-medium">Chief Judge:</span> <span className="font-mono">{modalTraining.chiefJudge}</span>
            </div>
          )}
          {modalTraining.standingView && Array.isArray(modalTraining.standingView) && (
            <div className="mb-1 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-medium">Standing View:</span> {modalTraining.standingView.join(", ")}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container py-8 mx-auto">
      {renderDetailsModal()}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trainings</h1>
          <p className="text-muted-foreground mt-2">
            Manage and join ICPC programming training sessions
          </p>
        </div>
        <div className="flex gap-4">
          {isAdminOrStaff && (
            <Button asChild>
              <Link href="/admin-only/create-training">Create Training</Link>
            </Button>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        <button
          className={`px-4 py-2 font-medium border-b-2 ${tab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setTab('all')}
        >
          All Trainings
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 ${tab === 'my' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
          onClick={() => setTab('my')}
        >
          My Trainings
        </button>
      </div>
      {/* Tab Content */}
      {tab === 'all' && (
        <div>
          {allTrainings.length === 0 ? (
            <div className="text-center p-12 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Trainings Available</h3>
              <p className="text-muted-foreground">
                There are no training sessions available at the moment. Please check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allTrainings.map((training) => {
                const statusText = training.status ? training.status.charAt(0).toUpperCase() + training.status.slice(1) : 'Unknown';
                const id = training.id ?? training.trainingId;
                const isEnrolled = enrolledIds.includes(id!);
                return (
                  <Card key={id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{training.title}</CardTitle>
                        <Badge className={getStatusColor(training.status ?? '')}>
                          {statusText}
                        </Badge>
                      </div>
                      <CardDescription>
                        {formatDate(training.startDate)}
                        {training.duration && ` • ${training.duration} days`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{training.description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-row gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setModalTraining(training)}
                        className="min-w-[90px]"
                      >
                        Details
                      </Button>
                      {isEnrolled ? (
                        <Button
                          asChild
                          className="min-w-[140px] font-semibold"
                        >
                          <Link href={`/protected/trainings/${id}`}>
                            Go to Dashboard
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          onClick={async () => {
                            await fetch(`/protected/api/training/join/${id}`);
                            window.location.reload();
                          }}
                          className="min-w-[90px] font-semibold"
                        >
                          Apply
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
      {tab === 'my' && (
        <div>
          {myTrainings.length === 0 ? (
            <div className="text-center p-12 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Enrolled Trainings</h3>
              <p className="text-muted-foreground mb-4">
                You haven't joined any training sessions yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTrainings.map((training) => {
                const statusText = training.status ? training.status.charAt(0).toUpperCase() + training.status.slice(1) : 'Unknown';
                const id = training.id ?? training.trainingId;
                return (
                  <Card key={training.trainingId} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{training.title}</CardTitle>
                        <Badge className={getStatusColor(training.status ?? '')}>
                          {statusText}
                        </Badge>
                      </div>
                      <CardDescription>
                        {formatDate(training.startDate)}
                        {training.duration && ` • ${training.duration} days`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-3">{training.description}</p>
                    </CardContent>
                    <CardFooter className="flex flex-row gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setModalTraining(training)}
                        className="min-w-[90px]"
                      >
                        Details
                      </Button>
                      <Button
                        asChild
                        className="min-w-[140px] font-semibold"
                      >
                        <Link href={`/protected/trainings/${id}`}>
                          Go to Dashboard
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 