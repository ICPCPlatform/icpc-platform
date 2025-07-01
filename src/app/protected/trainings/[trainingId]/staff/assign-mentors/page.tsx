import { db } from "@/lib/db";
import { Users } from "@/lib/db/schema/user/Users";
import { MentorTrainees } from "@/lib/db/schema/training/MentorTrainees";
import { Staff } from "@/lib/db/schema/training/Staff";
import { eq, and, isNull } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AssignMentorRow } from "./AssignMentorRow";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "@/components/ui/table";
import { Trainees } from "@/lib/db/schema/training/Trainees";

export default async function AssignMentorsPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;
  if (!trainingId) return <h1>Invalid training ID</h1>;
  if (isNaN(Number(trainingId))) return <h1>Invalid training ID</h1>;

  const [trainees, mentors] = await Promise.all([
    // get all trainees for the training
    db
      .select({
        userId: Users.userId,
        username: Users.username,
        mentorId: MentorTrainees.mentorId,
      })
      .from(Trainees)
      .where(and(eq(Trainees.trainingId, Number(trainingId))))
      .leftJoin(
        MentorTrainees,
        and(
          eq(Trainees.userId, MentorTrainees.userId),
          eq(MentorTrainees.trainingId, Number(trainingId)),
          isNull(MentorTrainees.deleted),
        ),
      )
      .innerJoin(Users, eq(Trainees.userId, Users.userId))

      .execute(),
    // get all mentors for the training
    db
      .select({
        userId: Staff.userId,
        username: Users.username,
      })
      .from(Staff)
      .where(
        and(
          eq(Staff.trainingId, Number(trainingId)),
          eq(Staff.mentor, true),
          isNull(Staff.deleted),
        ),
      )
      .innerJoin(Users, eq(Staff.userId, Users.userId))
      .execute(),
  ]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Assign Mentors to Trainees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trainee</TableHead>
                  <TableHead>Current Mentor</TableHead>
                  <TableHead>Assign Mentor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainees.map((trainee) => (
                  <AssignMentorRow
                    key={trainee.userId}
                    trainee={trainee}
                    mentors={mentors}
                    trainingId={Number(trainingId)}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
