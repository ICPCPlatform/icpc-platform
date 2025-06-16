import { db } from "@/lib/db";
import { Trainings } from "@/lib/db/schema/training/Trainings";
import { isNull } from "drizzle-orm";
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
  title: "All Trainings | ICPC Platform",
  description: "Browse all available ICPC programming training sessions",
};

export const dynamic = "force-dynamic";

// Function to format dates nicely
function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
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

export default async function TrainingsPage() {
  // Fetch all non-deleted trainings
  const trainings = await db
    .select({
      id: Trainings.trainingId,
      title: Trainings.title,
      description: Trainings.description,
      startDate: Trainings.startDate,
      duration: Trainings.duration,
      status: Trainings.status,
    })
    .from(Trainings)
    .where(isNull(Trainings.deleted))
    .execute();

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Trainings</h1>
          <p className="text-muted-foreground mt-2">
            Browse and join ICPC programming training sessions
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/protected/trainings/my-trainings">My Trainings</Link>
          </Button>
          <Button asChild>
            <Link href="/protected/trainings/join-training">Join Training</Link>
          </Button>
        </div>
      </div>

      {trainings.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No Trainings Available</h3>
          <p className="text-muted-foreground">
            There are no training sessions available at the moment. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map((training) => (
            <Card key={training.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                  <Link href={`/protected/trainings/${training.id}/materials`}>
                    View Materials
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/protected/trainings/${training.id}`}>
                    Details
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
