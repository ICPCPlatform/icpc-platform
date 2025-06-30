import { db } from "@/lib/db";
import { Applications } from "@/lib/db/schema/training/Applications";
import { Users } from "@/lib/db/schema/user/Users";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { eq } from "drizzle-orm";
import ApplicationsTable from "./_ApplicationsTable";

export default async function ApplicationsManagementPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;
  if (!trainingId) return <div>Invalid training ID</div>;
  if (isNaN(Number(trainingId))) {
    return <div>Invalid training ID format</div>;
  }

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


  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Trainee Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApplicationsTable
              applications={applications.map((app) => ({
                ...app,
                status: app.status ?? "pending",
                appliedAt:
                  typeof app.appliedAt === "string"
                    ? app.appliedAt
                    : app.appliedAt.toISOString(),
              }))}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
