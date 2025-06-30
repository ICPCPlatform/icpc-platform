"use server";
import { db } from "@/lib/db";
import { Applications } from "@/lib/db/schema/training/Applications";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function handleBulkAction(
  bulk: {
    applicationId: number;
    userId: string;
    action: "accept" | "reject" | "pending";
  }[],
  trainingId: number,
) {
  try {
    const schema = z.array(
      z.object({
        applicationId: z.number().int().positive(),
        userId: z.string().min(1),
        action: z.enum(["accept", "reject", "pending"]),
      }),
    );
    schema.parse(bulk);
    await db.transaction(async (tx) => {
      for (const { applicationId, action } of bulk) {
        await tx
          .update(Applications)
          .set({ status: action })
          .where(eq(Applications.applicationId, applicationId))
          .execute();
      }
    });
  } catch (error) {
    console.error("Error in handleBulkAction:", error);
    throw new Error("Failed to process bulk action");
  } finally {
    revalidatePath(`/protected/trainings/${trainingId}/staff/applications`);
  }
}
