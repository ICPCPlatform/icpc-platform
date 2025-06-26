"use client";

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
import { useState } from "react";

type AddContestButtonProps = {
  trainingId: number;
  blocks: Array<{ blockNumber: number; title: string }>;
};

export function AddContestButton({ trainingId, blocks }: AddContestButtonProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <AddContestForm trainingId={trainingId} blocks={blocks} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
