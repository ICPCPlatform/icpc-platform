"use server";

import { db } from "@/lib/db";
import { Staff } from "@/lib/db/schema/training/Staff";
import {getUserData} from "@/lib/session";
import {Users} from "@/lib/db/schema/user/Users";
import {eq, and } from "drizzle-orm";
import { z } from 'zod';
import { revalidatePath } from "next/cache";

const addStaffSchema = z.object({
    trainingId: z.coerce.number().int().positive(),
    username: z.string().min(1, 'User ID is required'),
    roles: z.object({
        instructor: z.boolean(),
        problem_setter: z.boolean(),
        mentor: z.boolean(),
    })
});

const deleteStaffSchema = z.object({
    trainingId: z.coerce.number().int().positive(),
    username: z.string().min(1, 'User ID is required'),
})
const searchByUsernameSchema = z.object({
    username: z.string().min(3, 'Username is required'),
    trainingId: z.coerce.number().int().positive(),

});

const updateStaffSchema = z.object({
    trainingId: z.coerce.number().int().positive(),
    username: z.string().min(1, 'User ID is required'),
    roles: z.object({
        instructor: z.boolean(),
        problem_setter: z.boolean(),
        mentor: z.boolean(),
    })
});

export async function addStaffAction({
    trainingId,
    username,
    roles,
}: {
    trainingId: string | number;
    username: string;
    roles: { instructor: boolean; problem_setter: boolean; mentor: boolean };
}) {
    const parseResult = addStaffSchema.safeParse({ trainingId, username, roles });
    if (!parseResult.success) {
        console.log(parseResult.error)
        return { success: false, error: parseResult.error.errors[0].message };
    }
    try {
        const res = await db.select({userId: Users.userId}).from(Users).where(eq(Users.username, username)).execute()
        if (res.length === 0) throw Error('user not found');
        const insertData = {
            trainingId: Number(trainingId),
            userId : res[0].userId,
            instructor: roles.instructor,
            problemSetter: roles.problem_setter,
            mentor: roles.mentor,
        } satisfies typeof Staff.$inferInsert;
        await db.insert(Staff).values(insertData).execute();
        revalidatePath(`/protected/trainings/${trainingId}/staff/edit-training/add-staff`);
        return { success: true };
    } catch (error) {
        console.error("Error adding staff:", error);
        return { success: false, error: "Failed to add staff" };
    }
}

export async function searchByUsername(username: string, trainingId: number) {
    const parseResult = searchByUsernameSchema.safeParse({ username, trainingId });
    if (!parseResult.success) {
        throw Error(parseResult.error.errors[0].message);
    }
    try {
        const userData = await getUserData();

        if (userData == null || userData.role !== "admin") {
            throw Error("Unauthorized access");
        }
        const staff = await db
            .select({
                username: Users.username,
                    instructor: Staff.instructor,
                    problemSetter: Staff.problemSetter,
                    mentor: Staff.mentor,
            })
            .from(Users)
            .where(eq(Users.username, username))
            .leftJoin(Staff, and(
                eq(Staff.userId, Users.userId),
                eq(Staff.trainingId, trainingId)
            ))
            .execute();
            // 
            revalidatePath(`protected/trainings/${trainingId}/staff/edit-training/add-staff`)
        return staff;
    } catch (error) {
        console.error("Error searching by username:", error);
        throw Error("Error occurred while searching for user");
    }
}

export async function deleteStaff({
    trainingId,
    username,
}: {
    trainingId: string | number;
    username: string;
}) {
    const parseResult = deleteStaffSchema.safeParse({ trainingId, username });
    if (!parseResult.success) {
        console.log(parseResult.error)
        return { success: false, error: parseResult.error.errors[0].message };
    }
    try {
        const res = await db.select({userId: Users.userId}).from(Users).where(eq(Users.username, username)).execute()
        if (res.length === 0) throw Error('user not found');

        await db
          .update(Staff)
          .set({ deleted: new Date() })
          .where(
            and(
              eq(Staff.userId, res[0].userId),
              eq(Staff.trainingId, Number(trainingId))
            )
          )
          .execute();

        revalidatePath(`/protected/trainings/${trainingId}/staff/edit-training/add-staff`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting staff:", error);
        return { success: false, error: "Failed to delete staff" };
    }
}

export async function updateStaff({
    trainingId,
    username,
    roles,
}: {
    trainingId: string | number;
    username: string;
    roles: { instructor: boolean; problem_setter: boolean; mentor: boolean };
}) {
    const parseResult = updateStaffSchema.safeParse({ trainingId, username, roles });
    if (!parseResult.success) {
        console.log(parseResult.error)
        return { success: false, error: parseResult.error.errors[0].message };
    }
    try {
        const res = await db.select({userId: Users.userId}).from(Users).where(eq(Users.username, username)).execute();
        if (res.length === 0) throw Error('user not found');

        await db
            .update(Staff)
            .set({
                instructor: roles.instructor,
                problemSetter: roles.problem_setter,
                mentor: roles.mentor,
                deleted: null // In case you want to "undelete" a staff member
            })
            .where(
                and(
                    eq(Staff.userId, res[0].userId),
                    eq(Staff.trainingId, Number(trainingId))
                )
            )
            .execute();

        revalidatePath(`/protected/trainings/${trainingId}/staff/edit-training/add-staff`);
        return { success: true };
    } catch (error) {
        console.error("Error updating staff:", error);
        return { success: false, error: "Failed to update staff" };
    }
}

