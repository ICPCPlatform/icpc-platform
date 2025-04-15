'use server';

import { z } from 'zod';
import { contestSchema } from '@/lib/validation/contestValidations';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import {Contests} from '@/lib/db/schema/training/Contests';
import {and, eq} from "drizzle-orm";
import {UserDataJWT} from "@/lib/session";
import {getUserTrainingPermissions} from "@/lib/permissions/getUserTrainingPermissions";

type FormData = z.infer<typeof contestSchema>;

export async function updateContest({trainingId, blockNumber, contestId, ...data }
                                        : FormData & {trainingId: string;blockNumber: string; contestId: string }) {
    const headers = new Headers();
    const { userId } = JSON.parse(
        headers.get("x-user") ?? "{'userId':''}",
    ) as UserDataJWT ;
    if (isNaN(Number(trainingId))) {
        return;
    }
    const userPermissions = await getUserTrainingPermissions(userId, Number(trainingId));
    if (!userPermissions.includes("Edit:contest")) {
        return;
    }
    if (isNaN(Number(trainingId))) {
        return;
    }

    try {
        await db
            .update(Contests)
            .set({
                title: data.title,
                description: data.description,
                type: data.type,
                firstPoints: Number(data.firstPoints),
            })
            .where(
                and(
                eq(Contests.contestId, contestId),
                eq(Contests.trainingId, Number(trainingId)),
                eq(Contests.blockNumber, Number (blockNumber))
                )
            );

        revalidatePath(`/protected/trainings/${trainingId}`);
    } catch (error) {
        console.error("Failed to update contest:", error);
        throw new Error("Failed to update contest");
    }
}
