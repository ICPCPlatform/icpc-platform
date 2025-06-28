import { db } from "@/lib/db";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { Staff } from "@/lib/db/schema/training/Staff";
import { Users } from "@/lib/db/schema/user/Users";
import { eq, and } from "drizzle-orm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import AssignMentorsTable from "./AssignMentorsTable";

export default async function AssignMentorsPage({ params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  if (!trainingId) return <div>Invalid training ID</div>;

  // Fetch all trainees for this training
  const trainees = await db
    .select({
      userId: Trainees.userId,
      mentorId: Trainees.mentorId,
      username: Users.username,
      gmail: Users.gmail,
    })
    .from(Trainees)
    .where(eq(Trainees.trainingId, Number(trainingId)))
    .innerJoin(Users, eq(Trainees.userId, Users.userId))
    .execute();

  // Fetch all mentors for this training
  const mentors = await db
    .select({
      userId: Staff.userId,
      username: Users.username,
      gmail: Users.gmail,
    })
    .from(Staff)
    .where(and(eq(Staff.trainingId, Number(trainingId)), eq(Staff.mentor, true)))
    .innerJoin(Users, eq(Staff.userId, Users.userId))
    .execute();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Assign Mentors to Trainees</CardTitle>
          </CardHeader>
          <AssignMentorsTable trainees={trainees} mentors={mentors} trainingId={Number(trainingId)} />
        </Card>
      </div>
    </div>
  );
} 