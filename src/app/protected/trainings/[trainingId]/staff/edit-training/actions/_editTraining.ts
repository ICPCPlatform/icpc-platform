"use server"
import {getUserData} from "@/lib/session";
import {getUserTrainingPermissions} from "@/lib/permissions/getUserTrainingPermissions";
import {cache} from "react";
import {db} from "@/lib/db";
import {and, eq, isNull} from "drizzle-orm";
import {Trainings} from "@/lib/db/schema/training/Trainings";
import {TrainingFormData} from "@/lib/validation/training/trainingValidations";
import {TrainingEdit} from "@/app/protected/trainings/[trainingId]/staff/edit-training/_trainingForm";


// This function fetches training data by ID, ensuring the user has the necessary permissions to view the training.


/**
 * Fetches a training by ID.
 * @param trainingId - The ID of the training.
 * @Returns {Promise<Trainings | null>} - Returns the training or null if an error occurs.
 */
export const getTraining = cache(async (trainingId: number) => {
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

        const canViewTraining = "View:training";
        if (!permissions.includes(canViewTraining)) {
            console.error("User does not have permission to view training");
            return null;
        }

        // Fetch training from the database

        const data = await db
            .select({
                trainingId: Trainings.trainingId,
                title: Trainings.title,
                description: Trainings.description,
                startDate: Trainings.startDate,
                duration: Trainings.duration,
                status: Trainings.status,
                headId: Trainings.headId,
                chiefJudge: Trainings.chiefJudge,
                deleted: Trainings.deleted,
            })
            .from(Trainings)
            .where(eq(Trainings.trainingId, trainingId))
            .execute();

        return {
            ...data[0],
            startDate: new Date(data[0].startDate), // Convert string to Date
        } as TrainingEdit;

    } catch (error) {
        console.error("Error fetching training:", error);
        return null;
    }
});

/**
 * Fetches user permissions for editing training.
 * @param trainingId - The ID of the training.
 * @returns {Promise<boolean | null>} - Returns true if the user has permission to edit training, false otherwise.
 */
export const getUserEditTrainingPermissions = cache(async (trainingId: number) => {
    try {
        console.log("Fetching user permissions for editing training...");
        const user = await getUserData();
        if (!user) {
            console.error("User not authenticated");
            return null;
        }
        const {userId} = user;
        
        const permissions = await getUserTrainingPermissions(userId, trainingId);
        if (!permissions) {
            console.error("Failed to fetch user permissions");
            return null;
        }

        // Check if the user has permission to edit training
        if (!permissions.includes("Edit:training")) {
            console.error("User does not have permission to edit training");
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return null;
    }
});

/**
 * Updates a training in the database.
 * @param trainingId - The ID of the training.
 * @param data - The training data to update.
 *
 * @Returns {Promise<void | null>} - Returns null if an error occurs.
 */
export async function updateTraining({trainingId, ...data}: TrainingFormData & {
    trainingId: number
}) {
    console.log("Updating training with ID:", trainingId);
    const { title, description, startDate: startDateStr, duration, status } = data;

    try {
        const userPermissions = await getUserEditTrainingPermissions(trainingId);
        if (!userPermissions) {
            console.error("User does not have permission to edit training");
            return null;
        }

        const startDate = startDateStr.toISOString().split('T')[0];

        await db
            .update(Trainings)
            .set({
                title,
                description,
                startDate,
                duration,
                status
            })
            .where(
                and(
                    eq(Trainings.trainingId, trainingId),
                    isNull(Trainings.deleted)
                )
            )
            .execute();
    } catch (error) {
        console.error("Error updating training:", error);
        throw error
    }
}