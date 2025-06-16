import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddContestForm } from "./_addContest";
import { db } from "@/lib/db";
import { Blocks } from "@/lib/db/schema/training/Blocks";
import { eq, and, isNull } from "drizzle-orm";

type AddContestButtonProps = {
  trainingId: number;
};

export async function AddContestButton({ trainingId }: AddContestButtonProps) {
  const blocks = await db
    .select({
      blockNumber: Blocks.blockNumber,
      title: Blocks.title,
    })
    .from(Blocks)
    .where(and(eq(Blocks.trainingId, trainingId), isNull(Blocks.deleted)))
    .execute();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Contest
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contest</DialogTitle>
        </DialogHeader>
        <AddContestForm trainingId={trainingId} blocks={blocks}/>
      </DialogContent>
    </Dialog>
  );
}
