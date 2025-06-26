import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StaffTabs from "./StaffTabs";
import { db } from "@/lib/db";
import { Staff } from "@/lib/db/schema/training/Staff";
import { Users } from "@/lib/db/schema/user/Users";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";

export default async function StaffManagementPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;
  if (typeof trainingId === "undefined") return;

  const staffList = await getAllTrainingStaff(trainingId);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">
              Staff Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StaffTabs trainingId={Number(trainingId)} staffList={staffList} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const getAllTrainingStaffSchema = z.object({
  trainingId: z.string().regex(/^\d+$/, "Invalid training ID"),
});

async function getAllTrainingStaff(trainingId: string) {
  const parseResult = getAllTrainingStaffSchema.safeParse({ trainingId });
  if (!parseResult.success) {
    throw Error(parseResult.error.errors[0].message);
  }
  try {
    const staff = await db
      .select({
        username: Users.username,
        instructor: Staff.instructor,
        problemSetter: Staff.problemSetter,
        mentor: Staff.mentor,
      })
      .from(Staff)
      .where(
        and(eq(Staff.trainingId, Number(trainingId)), isNull(Staff.deleted)),
      )
      .innerJoin(Users, eq(Users.userId, Staff.userId))
      .execute();
    return staff;
  } catch (error) {
    console.error("Error fetching training staff:", error);
    throw Error("Failed to fetch training staff");
  }
}
