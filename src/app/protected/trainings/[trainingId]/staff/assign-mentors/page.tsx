import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { Staff } from "@/lib/db/schema/training/Staff";
import { eq, and, isNull } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { assignMentor } from "../mentors/actions/assignMentor";
import { unassignMentor } from "../mentors/actions/unassignMentor";
import { z } from "zod";
import { AssignMentorRow } from "./AssignMentorRow";

export default async function AssignMentorsPage({ params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  if (!trainingId) return <div>Invalid training ID</div>;

  // Fetch trainees with their current mentor
  const trainees = await db
    .select({
      userId: Trainees.userId,
      username: Users.username,
      mentorId: Trainees.mentorId,
    })
    .from(Trainees)
    .where(and(eq(Trainees.trainingId, Number(trainingId)), isNull(Trainees.deleted)))
    .innerJoin(Users, eq(Trainees.userId, Users.userId))
    .execute();

  // Fetch mentors
  const mentors = await db
    .select({
      userId: Staff.userId,
      username: Users.username,
    })
    .from(Staff)
    .where(and(eq(Staff.trainingId, Number(trainingId)), eq(Staff.mentor, true), isNull(Staff.deleted)))
    .innerJoin(Users, eq(Staff.userId, Users.userId))
    .execute();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Assign Mentors to Trainees</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="px-4 py-2 border">Trainee</th>
                  <th className="px-4 py-2 border">Current Mentor</th>
                  <th className="px-4 py-2 border">Assign Mentor</th>
                </tr>
              </thead>
              <tbody>
                {trainees.map((trainee) => (
                  <AssignMentorRow
                    key={trainee.userId}
                    trainee={trainee}
                    mentors={mentors}
                    trainingId={Number(trainingId)}
                  />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 