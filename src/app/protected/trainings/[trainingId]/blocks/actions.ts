import {cache} from "react";
import {db} from "@/lib/db";
import {and, eq} from "drizzle-orm";
import {Blocks} from "@/lib/db/schema/training/Blocks";
import {Contests} from "@/lib/db/schema/training/Contests";

export const getBlocks = cache(async (trainingIdNumber: number) => {
    return db
        .select()
        .from(Blocks)
        .where(eq(Blocks.trainingId, trainingIdNumber));
});

export const getContests = cache(async (trainingId: number, blockNumber: number) => {
    return db.select()
        .from(Contests)
        .where(
            and(
                eq(Contests.trainingId, trainingId),
                eq(Contests.blockNumber, blockNumber)
            ));
});

