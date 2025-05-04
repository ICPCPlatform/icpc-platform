import { getUserData } from "@/lib/session";
import { getUserTrainingPermissions } from "@/lib/permissions/getUserTrainingPermissions";
import { cache } from "react";
import { db } from "@/lib/db";
import {and, eq} from "drizzle-orm";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { staffViewBlock } from "@/lib/types/staff/StaffTrainingTypes";
import {BlockFormData} from "@/lib/validation/training/blockValidations";

/**
 * Fetches all blocks for a given training ID.
 * @param trainingId - The ID of the training.
 * @Returns {Promise<staffViewBlock[] | null>} - Returns an array of blocks or null if an error occurs.
 */
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
        const resultBlocks : staffViewBlock[] = await db
            .select(
                {
                    blockNumber: Blocks.blockNumber,
                    title: Blocks.title,
                    description: Blocks.description,
                    trainingId: Blocks.trainingId,
                }
            )
            .from(Blocks)
            .where(eq(Blocks.trainingId, trainingId))
            .execute();

        return resultBlocks;
    } catch (error) {
        console.error("Error fetching blocks:", error);
        return null;
    }
});


/**
 * Fetches user permissions for editing blocks in a training.
 * @param trainingId - The ID of the training.
 * @returns {Promise<boolean | null>} - Returns true if the user has permission to edit blocks, false otherwise.
 */
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


/**
 * Updates a block in the database.
 * @param trainingId - The ID of the training.
 * @param blockNumber - The block number to update.
 * @param data - The block data to update (title and description).
 *
 * @Returns {Promise<void | null>} - Returns null if an error occurs.
 */
export async function updateBlock ({trainingId, blockNumber, ...data} : BlockFormData &{trainingId : number,blockNumber:number}) {
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
            ).execute();

        // got to the edit-blocks page
        window.location.href = `/protected/trainings/${trainingId}/staff/edit-blocks`;
    }
    catch (error) {
        console.error("Error updating block:", error);
        return null;
    }
}


/**
 * Deletes a block in the database.
 * @param trainingId
 * @param blockNumber
 *
 * @Returns {Promise<void | null>} - Returns null if an error occurs.
 */
export async function deleteBlock ({trainingId, blockNumber} : {trainingId : number,blockNumber:number}) {
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
                deleted: new Date(),
            })
            .where(
              and(
                  eq(Blocks.trainingId, trainingId),
                  eq(Blocks.blockNumber, blockNumber),
              )
            )
            .returning()
            .execute();
        // got to the edit-blocks page
        window.location.href = `/protected/trainings/${trainingId}/staff/edit-blocks`;
    }
    catch (error) {
        console.error("Error updating block:", error);
        return null;
    }
}


export async function createBlock () {
    //TODO: To be implemented
}