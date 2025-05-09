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
      return { success: false, error: "User not found" };
    }
    const userPermissions = new Set(
      ...(await getUserTrainingPermissions(user.userId, trainingId)),
    );

    if (!userPermissions.has("Edit:blocks")) {
      return {
        success: false,
        error: "You do not have permission to edit blocks",
      };
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
      return { success: false, error: "Validation error" };
    }
    console.error("Error updating block:", error);

    return { success: false, error: "Unknown error" };
  }
}
