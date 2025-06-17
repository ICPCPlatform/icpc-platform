"use server";

import { db } from "@/lib/db";
import { Staff } from "@/lib/db/schema/training/Staff";
import {getUserData} from "@/lib/session";
import {Users} from "@/lib/db/schema/user/Users";
import {eq} from "drizzle-orm";
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


export async function searchByUsername(username: string) {
    try {
        const userData = await getUserData();

        if (userData == null || userData.role !== "admin") {
            throw Error("Unautherized access");
        }
        const user = await db
            .select()
            .from(Users)
            .where(eq(Users.username, username))
            .execute();

        return user;
    } catch (error) {
        console.error("Error searching by username:", error);
        throw Error("Error occurred while searching for user");
    }
}
