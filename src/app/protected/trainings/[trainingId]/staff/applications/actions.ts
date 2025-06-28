"use server";
import { db } from "@/lib/db";
import { Applications } from "@/lib/db/schema/training/Applications";
import { Trainees } from "@/lib/db/schema/training/Trainees";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

export async function handleBulkAction(
  bulk: { applicationId: number; userId: string; action: "accept" | "reject" | "pending" }[],
  trainingId: number
) {
  const schema = z.array(z.object({
    applicationId: z.number().int().positive(),
    userId: z.string().min(1),
    action: z.enum(["accept", "reject", "pending"]),
  }));
  schema.parse(bulk);
  await db.transaction(async (tx) => {
    for (const { applicationId, userId, action } of bulk) {
      if (action === "accept") {
        await tx.update(Applications)
          .set({ status: "accepted" })
          .where(eq(Applications.applicationId, applicationId))
          .execute();
      } else if (action === "reject") {
        await tx.update(Applications)
          .set({ status: "rejected" })
          .where(eq(Applications.applicationId, applicationId))
          .execute();
        await tx.delete(Trainees)
          .where(and(eq(Trainees.userId, userId), eq(Trainees.trainingId, Number(trainingId))))
          .execute();
      } else if (action === "pending") {
        await tx.update(Applications)
          .set({ status: "pending" })
          .where(eq(Applications.applicationId, applicationId))
          .execute();
        await tx.delete(Trainees)
          .where(and(eq(Trainees.userId, userId), eq(Trainees.trainingId, Number(trainingId))))
          .execute();
      }
    }
  });
} 