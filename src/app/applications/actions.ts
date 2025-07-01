"use server";
import { db } from "@/lib/db";
import { Applications } from "@/lib/db/schema/training/Applications";
import { getUserData } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const trainingIdSchema = z.object({ trainingId: z.number().int().positive() });

export async function getUserApplications() {
  const user = await getUserData();
  if (!user) throw new Error("Not authenticated");
  return db.select().from(Applications).where(eq(Applications.userId, user.userId)).execute();
}

export async function applyToTraining(trainingId: number) {
  const user = await getUserData();
  if (!user) throw new Error("Not authenticated");
  const parse = trainingIdSchema.safeParse({ trainingId });
  if (!parse.success) throw new Error("Invalid trainingId");
  return await db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(Applications)
      .where(and(eq(Applications.userId, user.userId), eq(Applications.trainingId, trainingId)))
      .execute();
    if (existing.length > 0) throw new Error("Already applied");
    await tx.insert(Applications).values({
      userId: user.userId,
      trainingId,
      status: "pending",
      description: "",
    }).execute();
    return { success: true };
  });
}

export async function withdrawApplication(trainingId: number) {
  const user = await getUserData();
  if (!user) throw new Error("Not authenticated");
  const parse = trainingIdSchema.safeParse({ trainingId });
  if (!parse.success) throw new Error("Invalid trainingId");
  return await db.transaction(async (tx) => {
    const result = await tx
      .update(Applications)
      .set({ status: "withdrawn" })
      .where(and(eq(Applications.userId, user.userId), eq(Applications.trainingId, trainingId)))
      .execute();
    if (result.rowCount === 0) throw new Error("Application not found");
    return { success: true };
  });
} 
