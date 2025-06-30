import { db } from "@/lib/db";
import { Contests } from "@/lib/db/schema/training/Contests";
import { and, eq, isNull } from "drizzle-orm";
import { ContestsList } from "./_contestsList";
import { AddContestButton } from "./_addContestButton";
import { redirect } from "next/navigation";
import { Blocks } from "@/lib/db/schema/training/Blocks";

export default async function ContestsPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const trainingId = Number((await params).trainingId);
  if (isNaN(trainingId)) {
    redirect("not-found");
  }

  const blocks = await db
    .select({
      blockNumber: Blocks.blockNumber,
      title: Blocks.title,
    })
    .from(Blocks)
    .where(and(eq(Blocks.trainingId, trainingId), isNull(Blocks.deleted)))
    .execute();

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
      blockTitle: Blocks.title,
    })
    .from(Contests)
    .where(and(eq(Contests.trainingId, trainingId), isNull(Contests.deleted)))
    .innerJoin(Blocks, and(eq(Blocks.trainingId, Contests.trainingId), eq(Blocks.blockNumber, Contests.blockNumber)))
    .execute();

  return (
    <div className="container py-8 px-4 md:px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contests</h1>
        <AddContestButton trainingId={trainingId} blocks={blocks} />
      </div>

      <ContestsList contests={contests} trainingId={trainingId} />
    </div>
  );
}
