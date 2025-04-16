import {cache} from "react";
import {db} from "@/lib/db";
import {and, eq} from "drizzle-orm";
import {Blocks} from "@/lib/db/schema/training/Blocks";
import {UserDataJWT} from "@/lib/session";
import {getUserTrainingPermissions} from "@/lib/permissions/getUserTrainingPermissions";
import {blockValidations} from "@/lib/validation/blockValidations";
import { z } from "zod";


export const getBlocks = cache(async (trainingIdNumber: number) => {
    return db
        .select()
        .from(Blocks)
        .where(eq(Blocks.trainingId, trainingIdNumber));
});

export const getBlock = cache(async (blockNumber: number) => {
    return db
        .select()
        .from(Blocks)
        .where(eq(Blocks.blockNumber, blockNumber));
});
type FormData = z.infer<typeof blockValidations>;
export default async function updateBlock( {trainingId, blockNumber, ...data}: FormData & {trainingId: string;blockNumber: string }) {
    const { title, description } = data;    
    const headers = new Headers();
    const { userId } = JSON.parse(
        headers.get("x-user") ?? "{'userId':''}",
    ) as UserDataJWT ;

    if (isNaN(Number(trainingId))) {
        return;
    }
    const userPermissions = await getUserTrainingPermissions(userId, Number(trainingId));
    if (!userPermissions.includes("Edit:block")) {
        return;
    }
    if (isNaN(Number(blockNumber))) {
        return;
    }

    try {
        await db
            .update(Blocks)
            .set({
                title,
                description,
            })
            .where(
                and(
                    eq(Blocks.trainingId,Number( trainingId)),
                    eq(Blocks.blockNumber, Number(blockNumber)),
                ),
            );
    } catch (error) {
        console.error("Failed to update block:", error);
    }

}


