"use server";
import "server-only";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { UserDataJWT } from "@/lib/session";
import { Material } from "@/lib/types/training";
import { and, eq } from "drizzle-orm";

export async function editMaterial({
  trainingId,
  blockNumber,
  newMaterial,
}: {
  trainingId: number;
  blockNumber: number;
  newMaterial: Material;
}) {
  // get user id from headers
  const headers = new Headers();

  const { userId } = JSON.parse(
    headers.get("x-user") ?? "{'userId':''}",
  ) as UserDataJWT;

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
      material: newMaterial,
    })
    .where(
      and(
        eq(Blocks.blockNumber, blockNumber),
        eq(Blocks.trainingId, trainingId),
      ),
    );
}
