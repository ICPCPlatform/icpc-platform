import { db } from "@/lib/db";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { UserDataJWT } from "@/lib/session";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
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

export const metadata = {
  title: "My Trainings | ICPC Platform",
  description: "View your enrolled ICPC programming training sessions",
};

// Helper function to format dates
function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper function to get status badge color
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

export default async function MyTrainingsPage() {
  const userData = JSON.parse(
    (await headers()).get("x-user") ?? "",
  ) as UserDataJWT;

  const trainingData = await db
    .select({
      trainingId: Trainings.trainingId,
      title: Trainings.title,
      description: Trainings.description,
      startDate: Trainings.startDate,
      duration: Trainings.duration,
      status: Trainings.status,
    })
    .from(Trainings)
    .innerJoin(Trainees, eq(Trainings.trainingId, Trainees.trainingId))
    .where(eq(Trainees.userId, userData.userId))
    .execute();

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trainings</h1>
          <p className="text-muted-foreground mt-2">
            Your enrolled ICPC programming training sessions
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/protected/trainings">All Trainings</Link>
          </Button>
          <Button asChild>
            <Link href="/protected/trainings/join-training">Join Training</Link>
          </Button>
        </div>
      </div>

      {trainingData.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No Enrolled Trainings</h3>
          <p className="text-muted-foreground mb-4">
            You haven't joined any training sessions yet.
          </p>
          <Button asChild>
            <Link href="/protected/trainings/join-training">Browse Available Trainings</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingData.map((training) => (
            <Card key={training.trainingId} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{training.title}</CardTitle>
                  <Badge className={getStatusColor(training.status)}>
                    {training.status.charAt(0).toUpperCase() + training.status.slice(1)}
                  </Badge>
                </div>
                <CardDescription>
                  {formatDate(new Date(training.startDate))} 
                  {training.duration && ` • ${training.duration} days`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{training.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href={`/protected/trainings/${training.trainingId}/materials`}>
                    View Materials
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/protected/trainings/${training.trainingId}/leaderboard`}>
                    Go to Training
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
