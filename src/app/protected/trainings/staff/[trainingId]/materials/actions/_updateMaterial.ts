"use server";
import "server-only";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { UserDataJWT } from "@/lib/session";
import { Material } from "@/lib/types/training";
import { and, eq } from "drizzle-orm";

export async function updateMaterial({
  trainingId,
  blockNumber,
  newMaterials,
}: {
  trainingId: number;
  blockNumber: number;
  newMaterials: Material[];
}) {
  try{
  const userData = await getUserData();
  if (!userData) {
    return;
  }
  const userId = userData.userId;
  if (isNaN(trainingId)) {
    return;
  }
  const userPermissions = await getUserTrainingPermissions(userId, trainingId);

  if (!userPermissions.includes("Edit:material")) {
    return;
  }
  

  await (db
    .update(Blocks)
    .set({
      material: newMaterials,
    })
    .where(
      and(
        eq(Blocks.blockNumber, blockNumber),
        eq(Blocks.trainingId, trainingId),
      ),
    ).execute());
  } catch (error) {
    console.error("Error editing material:", error);
    throw new Error("Failed to edit material");
  }
}
