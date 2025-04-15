"use server";
import "server-only";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { UserDataJWT } from "@/lib/session";
import { Material } from "@/lib/types/Training";
import { and, eq } from "drizzle-orm";

export async function editMaterial(formData: FormData) {
  const trainingId = Number(formData.get("trainingId"));
  const blockNumber = Number(formData.get("blockNumber"));

  const title = formData.get("title") as string;
  const des = formData.get("des") as string;
  const link = formData.get("link") as string;

  const newMaterial = [{
    title,
    des,
    link,
  }] as Material[];


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

  // TODO : check the implementation of the updating material
  const newMaterialDTO = {
    [blockNumber]: newMaterial,
  } as Record<number, Material[]>;

  await db
    .update(Blocks)
    .set({
      material: newMaterialDTO
    })
    .where(
      and(
        eq(Blocks.blockNumber, blockNumber),
        eq(Blocks.trainingId, trainingId),
      ),
    );
}
