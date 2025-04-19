"use server";
import {cache} from "react";
import {db} from "@/lib/db";
import {and, eq} from "drizzle-orm";
import {Blocks} from "@/lib/db/schema/training/Blocks";
import {UserDataJWT} from "@/lib/session";
import {getUserTrainingPermissions} from "@/lib/permissions/getUserTrainingPermissions";
import {blockValidations} from "@/lib/validation/blockValidations";
import { z } from "zod";
import {redirect} from "next/navigation";

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
export default async function updateBlock( {trainingId, blockNumber, ...data}: FormData & {trainingId: number;blockNumber: number }) {
    const { title, description } = data;


    // check user login and permissions
    const headers = new Headers();
    try {
        const { userId } = JSON.parse(
            headers.get("x-user") ?? "{'userId':''}",
        ) as UserDataJWT ;

        if (!userId) {
            console.log("User ID not found in headers");
            redirect("/login");
        }
        const userPermissions = await getUserTrainingPermissions(userId, Number(trainingId));
        if (!userPermissions.includes("Edit:block")) {
            return;
        }
    }
    catch (error) {
        console.log("Failed to parse user ID:", error);
        redirect("/login");
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
                    eq(Blocks.trainingId,trainingId),
                    eq(Blocks.blockNumber,blockNumber),
                ),
            );
    } catch (error) {
        console.log("Failed to update block:", error);
    }

}


