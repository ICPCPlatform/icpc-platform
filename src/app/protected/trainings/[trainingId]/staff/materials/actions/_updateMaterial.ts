"use server";
import "server-only";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { getUserData } from "@/lib/session";
import { Material } from "@/lib/types/Training";
import { and, eq, isNotNull } from "drizzle-orm";
import { updateMaterialSchema } from "@/lib/validation/training/updateMaterial";
import { z } from "zod";

const inputSchema = z.object({
  trainingId: z.number().int(),
  blockNumber: z.number().int(),
  newMaterials: updateMaterialSchema,
});
export async function updateMaterial(input: {
  trainingId: number;
  blockNumber: number;
  newMaterials: Material[];
}) {
  try {
    const userData = await getUserData();
    const { trainingId, blockNumber, newMaterials } = inputSchema.parse(input);
    if (!userData) {
      return { success: false, error: "User not logged in" };
    }

    const userId = userData.userId;
    if (isNaN(trainingId)) {
      return { success: false, error: "Invalid trainingId" };
    }

    const userPermissions = await getUserTrainingPermissions(
      userId,
      trainingId,
    );

    if (!userPermissions.includes("Edit:material")) {
      return { success: false, error: "Permission denied" };
    }
    const blocks = await  db
      .select({})
      .from(Blocks)
      .where(
        and(
          eq(Blocks.blockNumber, blockNumber),
          isNotNull(Blocks.deleted),
          eq(Blocks.trainingId, trainingId),
        ),
      )
      .execute();

    if (blocks.length === 0) {
      return { success: false, error: "Block not found" };
    }
    await db
      .update(Blocks)
      .set({
        material: newMaterials,
      })
      .where(
        and(
          eq(Blocks.blockNumber, blockNumber),
          eq(Blocks.trainingId, trainingId),
          isNotNull(Blocks.deleted),
        ),
      )
      .execute();
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Validation error" };
    }

    console.error("Error editing material:", error); // don't remove
    return { success: false, error: "server error unkown" };
  }
}
