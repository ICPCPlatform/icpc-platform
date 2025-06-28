import { db } from "@/lib/db";
import { Applications } from "@/lib/db/schema/training/Applications";
import { Users } from "@/lib/db/schema/user/Users";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { eq, and } from "drizzle-orm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import ApplicationsTable from "./_ApplicationsTable";
import { Trainings } from "@/lib/db/schema/training/Trainings";

export default async function ApplicationsManagementPage({ params }: { params: Promise<{ trainingId: string }> }) {
  const { trainingId } = await params;
  if (!trainingId) return <div>Invalid training ID</div>;

  // Fetch all applications for this training
  const applications = await db
    .select({
      applicationId: Applications.applicationId,
      userId: Applications.userId,
      status: Applications.status,
      appliedAt: Applications.appliedAt,
      username: Users.username,
      gmail: Users.gmail,
    })
    .from(Applications)
    .where(eq(Applications.trainingId, Number(trainingId)))
    .innerJoin(Users, eq(Applications.userId, Users.userId))
    .orderBy(Applications.appliedAt)
    .execute();

  async function handleAction(applicationId: number, userId: string, action: "accept" | "reject" | "pending") {
    "use server";
    if (action === "accept") {
      await db.transaction(async (tx) => {
        await tx.update(Applications)
          .set({ status: "accepted" })
          .where(eq(Applications.applicationId, applicationId))
          .execute();
        const exists = await tx.select().from(Trainees)
          .where(and(eq(Trainees.userId, userId), eq(Trainees.trainingId, Number(trainingId))))
          .execute();
        if (exists.length === 0) {
          // Insert with a placeholder mentorId (headId) until mentor assignment feature is implemented
          const training = await tx.select({ headId: Trainings.headId })
            .from(Trainings)
            .where(eq(Trainings.trainingId, Number(trainingId)))
            .execute();
          const mentorId = training[0].headId;
          await tx.insert(Trainees).values({ userId, trainingId: Number(trainingId), mentorId: null }).execute();
        }
      });
    } else if (action === "reject") {
      await db.update(Applications)
        .set({ status: "rejected" })
        .where(eq(Applications.applicationId, applicationId))
        .execute();
      // Optionally, remove from trainees if present
      await db.delete(Trainees)
        .where(and(eq(Trainees.userId, userId), eq(Trainees.trainingId, Number(trainingId))))
        .execute();
    } else if (action === "pending") {
      await db.update(Applications)
        .set({ status: "pending" })
        .where(eq(Applications.applicationId, applicationId))
        .execute();
      // Optionally, remove from trainees if present
      await db.delete(Trainees)
        .where(and(eq(Trainees.userId, userId), eq(Trainees.trainingId, Number(trainingId))))
        .execute();
    }
    redirect(`/protected/trainings/${trainingId}/staff/applications`);
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">Trainee Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsTable applications={applications} handleAction={handleAction} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 