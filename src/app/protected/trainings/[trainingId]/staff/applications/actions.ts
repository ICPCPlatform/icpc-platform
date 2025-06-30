"use server";
import { db } from "@/lib/db";
import { Applications } from "@/lib/db/schema/training/Applications";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { getUserData } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  bulk: z.array(
    z.object({
      applicationId: z.number().int().positive(),
      userId: z.string().min(1),
      action: z.enum(["accept", "reject", "pending"]),
    }),
  ),
  trainingId: z.number().int().positive(),
});
export async function handleBulkAction(input: z.infer<typeof schema>) {
  try {
    const user = await getUserData();
    if (!user) {
      throw new Error("User not authenticated");
    }
    const { bulk, trainingId } = schema.parse(input);
    const permissions = await getUserTrainingPermissions(user.userId, input.trainingId);
    if(permissions.includes('Edit:applications')){
      throw new Error("User does not have permission to edit applications");
    }
    await db.transaction(async (tx) => {
      for (const { applicationId, action } of bulk) {
        tx
          .update(Applications)
          .set({ status: action })
          .where(eq(Applications.applicationId, applicationId))
          .execute();
      }
    });
    // 
    revalidatePath(`/protected/trainings/${trainingId}/staff/applications`);
  } catch (error) {
    console.error("Error in handleBulkAction:", error);
    throw new Error("Failed to process bulk action");
  }
}
