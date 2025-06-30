"use server";
import { db } from "@/lib/db";
import { Applications } from "@/lib/db/schema/training/Applications";
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
    const { bulk, trainingId } = schema.parse(input);
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
