"use server";
import "server-only";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { getUserData } from "@/lib/session";
import { Material} from "@/lib/types/Training";
import { and, eq } from "drizzle-orm";

export async function editMaterial({
  trainingId,
  blockNumber,
  newMaterials,
}: {
  trainingId: number;
  blockNumber: number;
  newMaterials: Material[];
}) {
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
  

  await db
    .update(Blocks)
    .set({
      material: newMaterials,
      // material: newMaterial,
    })
    .where(
      and(
        eq(Blocks.blockNumber, blockNumber),
        eq(Blocks.trainingId, trainingId),
      ),
    );
}
