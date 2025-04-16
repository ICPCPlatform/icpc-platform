'use server';

import { z } from 'zod';
import { contestValidations } from '@/lib/validation/contestValidations';
import { db } from '@/lib/db';

import {Contests} from '@/lib/db/schema/training/Contests';
import {and, eq} from "drizzle-orm";
import {UserDataJWT} from "@/lib/session";
import {getUserTrainingPermissions} from "@/lib/permissions/getUserTrainingPermissions";
import {Judge} from "@/lib/db/schema/training/Contests";
import {cache} from "react";



type FormData = z.infer<typeof contestValidations>;

export async function updateContest({trainingId, blockNumber, contestId, ...data }
                                        : FormData & {trainingId: string;blockNumber: string; contestId: string }) {
    const headers = new Headers();
    const { userId } = JSON.parse(
        headers.get("x-user") ?? "{'userId':''}",
    ) as UserDataJWT ;
    if (!userId) {
       return;
    }
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
                type: data.type?.toString(),
                firstPoints: Number(data.firstPoints),
                pointPerProblem: Number(data.pointPerProblem),
                calcSys: data.calcSys?.toString(),
                judge: data.judge as Judge,
                groupId: data.groupId?.toString(),  
            })
            .where(
                and(
                eq(Contests.contestId, contestId),
                eq(Contests.trainingId, Number(trainingId)),
                eq(Contests.blockNumber, Number (blockNumber))
                )
            );
    
    } catch (error) {
        console.error("Failed to update contest:", error);
    }
}


export const getContests = cache(async (trainingId: number, blockNumber: number) => {
    return db.select()
        .from(Contests)
        .where(
            and(
                eq(Contests.trainingId, trainingId),
                eq(Contests.blockNumber, blockNumber)
            ));
});
