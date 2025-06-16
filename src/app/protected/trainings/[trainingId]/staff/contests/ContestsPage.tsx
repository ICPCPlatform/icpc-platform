import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { Contests } from "@/lib/db/schema/training/Contests";
import { and, eq, isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AddContestButton } from "./_addContestButton";
import { ContestsList } from "./_contestsList";


export default async function ContestsPage({
    params,
}: {
    params: Promise<{ trainingId: string; }>;
}) {
    const trainingId = Number((await params).trainingId);
    if (isNaN(trainingId)) {
        redirect("not-found");
    }

    const contests = await db
        .select({
            trainingId: Contests.trainingId,
            blockNumber: Contests.blockNumber,
            contestId: Contests.contestId,
            judge: Contests.judge,
            type: Contests.type,
            title: Contests.title,
            description: Contests.description,
            date: Contests.date,
        })
        .from(Contests)
        .where(and(eq(Contests.trainingId, trainingId), isNull(Contests.deleted)))
        .innerJoin(Blocks, eq(Blocks.trainingId, Contests.trainingId))
        .execute();
    console.log(contests);

    return (
        <div className="container py-8 px-4 md:px-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Contests</h1>
                <AddContestButton trainingId={trainingId} />
            </div>

            <ContestsList contests={contests} trainingId={trainingId} />
        </div>
    );
}

