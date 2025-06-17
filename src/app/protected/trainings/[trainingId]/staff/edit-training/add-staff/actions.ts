"use server";

import { db } from "@/lib/db";
import { Staff } from "@/lib/db/schema/training/Staff";
export async function addStaffAction({
                                         trainingId,
                                         userId,
                                         roles,
                                     }: {
    trainingId: string;
    userId: string;
    roles: { instructor: boolean; problem_setter: boolean; mentor: boolean; chief_judge: boolean };
}) {
    try {
        const insertData = {
            trainingId: parseInt(trainingId),
            userId,
            instructor: roles.instructor,
            problemSetter: roles.problem_setter,
            mentor: roles.mentor,
        } satisfies typeof Staff.$inferInsert;

        await db.insert(Staff).values(insertData).execute();
        return { success: true };
    } catch (error) {
        console.error("Error adding staff:", error);
        return { success: false, error: "Failed to add staff" };
    }
}