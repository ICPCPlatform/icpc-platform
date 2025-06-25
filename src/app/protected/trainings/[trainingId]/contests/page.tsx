import { db } from "@/lib/db";
import { Contests } from "@/lib/db/schema/training/Contests";
import { and, eq, isNull } from "drizzle-orm";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { ContestsList } from "../staff/contests/_contestsList";

export default async function ContestsPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;
  const trainingIdNumber = Number(trainingId);
  if (isNaN(trainingIdNumber)) {
    return <div>Invalid training ID</div>;
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
      blockTitle: Blocks.title,
    })
    .from(Contests)
    .where(and(eq(Contests.trainingId, trainingIdNumber), isNull(Contests.deleted)))
    .innerJoin(Blocks, eq(Blocks.trainingId, Contests.trainingId))
    .execute();

  return (
    <div className="container py-8 px-4 md:px-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Contests</h1>
      <ContestsList contests={contests} trainingId={trainingIdNumber} />
    </div>
  );
} 