"use server";
import "server-only";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { getUserData } from "@/lib/session";
import { Material } from "@/lib/types/Training";
import { and, eq } from "drizzle-orm";
import { updateMaterialSchema } from "@/lib/validation/training/update_material";
import { z } from "zod";

export async function updateMaterial({
  trainingId,
  blockNumber,
  newMaterials,
}: {
  trainingId: number;
  blockNumber: number;
  newMaterials: Material[];
}) {
  try {
    const userData = await getUserData();
    if (!userData) {
      return;
    }

    const userId = userData.userId;
    if (isNaN(trainingId)) {
      return;
    }

    
    const userPermissions = await getUserTrainingPermissions(
      userId,
      trainingId,
    );

    if (!userPermissions.includes("Edit:material")) {
      return;
    }


    const newMaterialsParsed = updateMaterialSchema.parse(newMaterials);

    await db
      .update(Blocks)
      .set({
        material: newMaterialsParsed,
      })
      .where(
        and(
          eq(Blocks.blockNumber, blockNumber),
          eq(Blocks.trainingId, trainingId),
        ),
      )
      .execute();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error("Validation error");
    }

    console.error("Error editing material:", error);
    throw new Error("Failed to edit material");
  }
}
