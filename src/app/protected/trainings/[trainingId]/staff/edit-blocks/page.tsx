import { UpdateBlock } from "./_updateBlock";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { and, eq, isNull, sql } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function EditBlocksPage({
  params,
}: {
  params: Promise<{ trainingId: string }>;
}) {
  const { trainingId } = await params;
  const trainingIdNumber = parseInt(trainingId);
  if (isNaN(trainingIdNumber)) {
    redirect("404");
  }

  const blocks = await db
    .select({
      blockNumber: Blocks.blockNumber,
      title: Blocks.title,
      description: Blocks.description,
      date: sql<string>`to_char(${Blocks.date}, 'YYYY-MM-DD')`,
      hidden: Blocks.hidden,
    })
    .from(Blocks)
    .where(and(eq(Blocks.trainingId, trainingIdNumber), isNull(Blocks.deleted)))
    .orderBy(Blocks.blockNumber);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Training Blocks</h1>
      <div className="grid gap-6">
        <UpdateBlock trainingId={trainingIdNumber} initialBlocks={blocks} />
      </div>
    </div>
  );
}
