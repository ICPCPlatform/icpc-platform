import { getUserData } from "@/lib/session";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { cache } from "react";
import { db } from "@/lib/db";
import {and, eq} from "drizzle-orm";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { staffViewBlock } from "@/lib/types/staff/StaffTrainingTypes";
import {BlockFormData} from "@/lib/validation/training/blockValidations";


export const getAllBlocks = cache(async (trainingId: number) => {
    try {
        // Fetch user data
        const user = await getUserData();
        if (!user) {
            console.error("User not authenticated");
            return null;
        }

        const { userId } = user;

        // Fetch user permissions
        const permissions = await getUserTrainingPermissions(userId, trainingId);
        if (!permissions) {
            console.error("Failed to fetch user permissions");
            return null;
        }

        const canViewBlock = "View:block";
        if (!permissions.includes(canViewBlock)) {
            console.error("User does not have permission to view blocks");
            return null;
        }

        // Fetch all blocks from the database
        const resultBlocks = await db
            .select({
                blockNumber: Blocks.blockNumber,
                trainingId: Blocks.trainingId,
                title: Blocks.title,
                description: Blocks.description,
            })
            .from(Blocks)
            .where(eq(Blocks.trainingId, trainingId))
            .execute();

        return resultBlocks as staffViewBlock[];
    } catch (error) {
        console.error("Error fetching blocks:", error);
        return null;
    }
});


export const getUserEditBlockPermissions = cache(async (trainingId: number) => {
    try {

        const user = await getUserData();
        if (!user) {
            console.error("User not authenticated");
            return null;
        }
        const { userId } = user;
        //
        const permissions = await getUserTrainingPermissions(userId, trainingId);
        if (!permissions) {
            console.error("Failed to fetch user permissions");
            return null;
        }

        const canEditBlock = "Edit:block";
        if (!permissions.includes(canEditBlock)) {
            console.error("User does not have permission to edit blocks");
            return null;
        }

        return true;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return null;
    }
});


export default async function updateBlock ({trainingId, blockNumber, ...data} : BlockFormData &{trainingId : number,blockNumber:number}) {
    const { title, description } = data;
    try {
        const userPermissions = await getUserEditBlockPermissions(trainingId);
        if (!userPermissions) {
            console.error("User does not have permission to edit blocks");
            return null;
        }
        // Update block in the database
        await db
            .update(Blocks)
            .set({
                title,
                description,
            })
            .where(
              and(
                  eq(Blocks.trainingId, trainingId),
                  eq(Blocks.blockNumber, blockNumber),
              )
            )
            .returning()
            .execute();
    }
    catch (error) {
        console.error("Error updating block:", error);
        return null;
    }
}