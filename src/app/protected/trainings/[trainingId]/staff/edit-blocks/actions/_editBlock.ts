"use server"
import {getUserData} from "@/lib/session";
import {getUserTrainingPermissions} from "@/lib/permissions/getUserTrainingPermissions";
import {cache} from "react";
import {db} from "@/lib/db";
import {and, eq} from "drizzle-orm";
import {Blocks} from "@/lib/db/schema/training/Blocks";
import {BlockFormData} from "@/lib/validation/training/blockValidations";

/**
 * Fetches all blocks for a given training ID.
 * @param trainingId - The ID of the training.
 * @Returns {Promise<Blocks[] | null>} - Returns an array of blocks or null if an error occurs.
 */
export const getAllBlocks = cache(async (trainingId: number) => {
    try {
        // Fetch user data
        const user = await getUserData();
        if (!user) {
            console.error("User not authenticated");
            return null;
        }

        const {userId} = user;

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
        return await db
            .select(
                {
                    blockNumber: Blocks.blockNumber,
                    title: Blocks.title,
                    description: Blocks.description,
                    trainingId: Blocks.trainingId,
                    hidden: Blocks.hidden,
                }
            )
            .from(Blocks)
            .where(eq(Blocks.trainingId, trainingId))
            .execute();
    } catch (error) {
        console.error("Error fetching blocks:", error);
        return null;
    }
});


/**
 * Fetches all blocks for a given training ID.
 * @param trainingId - The ID of the training.
 * @Returns {Promise<Blocks[] | null>} - Returns an array of blocks or null if an error occurs.
 */
export const getBlockByNumber = cache(async (trainingId: number, blockNumber: number) => {
    try {
        // Fetch user data
        const user = await getUserData();
        if (!user) {
            console.error("User not authenticated");
            return null;
        }

        const {userId} = user;

        // Fetch user permissions
        const permissions = await getUserTrainingPermissions(userId, trainingId);
        if (!permissions) {
            console.error("Failed to fetch user permissions");
            return null;
        }

        if (!permissions.includes("View:block")) {
            console.error("User does not have permission to view blocks");
            return null;
        }

        // Fetch all blocks from the database
        return await db
            .select(
                {
                    blockNumber: Blocks.blockNumber,
                    title: Blocks.title,
                    description: Blocks.description,
                    trainingId: Blocks.trainingId,
                    hidden: Blocks.hidden,
                    date: Blocks.date,
                }
            )
            .from(Blocks)
            .where(
                and(
                    eq(Blocks.blockNumber, blockNumber),
                    eq(Blocks.trainingId, trainingId)
                )
            )
            .execute();
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

        console.log("Fetching user permissions for editing blocks...");
        const user = await getUserData();
        if (!user) {
            console.error("User not authenticated");
            return null;
        }
        const {userId} = user;
        //
        const permissions = await getUserTrainingPermissions(userId, trainingId);
        if (!permissions) {
            console.error("Failed to fetch user permissions");
            return null;
        }

        // Check if the user has permission to edit blocks
        if (!permissions.includes("Edit:block")) {
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
export async function updateBlock({trainingId, blockNumber, ...data}: BlockFormData & {
    trainingId: number,
    blockNumber: number
}) {
    const {title, description, date, hidden} = data;
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
                date,
                hidden,
            })
            .where(
                and(
                    eq(Blocks.trainingId, trainingId),
                    eq(Blocks.blockNumber, blockNumber),
                )
            ).execute();

    } catch (error) {
        console.error("Error updating block:", error);
        return null;
    }
}
