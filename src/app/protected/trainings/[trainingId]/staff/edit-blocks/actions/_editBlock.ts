"use server";
import "server-only";
import { db } from "@/lib/db";
import { updateBlockSchema } from "@/lib/validation/training/updateBlocks";
import { z } from "zod";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { and, eq } from "drizzle-orm";
import { getUserData } from "@/lib/session";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";

const inputSchema = z.object({
  trainingId: z.number().int(),
  blockNumber: z.number().int(),
  newBlockData: updateBlockSchema,
});

export async function updateBlock(input: z.infer<typeof inputSchema>) {
  try {
    const { trainingId, blockNumber, newBlockData } = inputSchema.parse(input);
    const user = await getUserData();

    if (!user) {
      throw new Error('unautherized');
    }
    const userPermissions = await getUserTrainingPermissions(user.userId, trainingId)

    if (!userPermissions.includes("Edit:block")) {
      throw new Error("unautherized")
    }
    db
      .update(Blocks)
      .set({
        title: newBlockData.title,
        description: newBlockData.description,
        date: new Date(newBlockData.date),
        hidden: newBlockData.hidden,
      })
      .where(
        and(
          eq(Blocks.blockNumber, blockNumber),
          eq(Blocks.trainingId, trainingId),
        ),
      )
      .execute();
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // return zod error
      throw new Error(error.issues
        .map((issue) => 
          `${issue.path.join('.')}: ${issue.message}`)
        .join('\n'));
    }
    console.error("Error updating block:", error);

    throw error;
  }
}
