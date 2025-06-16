"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteContestAction } from "./actions/deleteContest";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateContestForm } from "./_updateContest";

type Contest = {
  trainingId: number;
  blockNumber: number;
  contestId: string;
  blockTitle: string;
  judge: string;
  type: string;
  title: string;
  description: string;
  date: Date;
};

type ContestCardProps = {
  contest: Contest;
  trainingId: number;
};

export function ContestCard({ contest}: ContestCardProps) {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);

  async function handleDelete() {
    try {
      await deleteContestAction({
        trainingId: contest.trainingId,
        blockNumber: contest.blockNumber,
        contestId: contest.contestId,
      });
      
      toast({
        title: "Success",
        description: "Contest deleted successfully",
      });
      
      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete contest",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{contest.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Type:</span>
              <span className="text-muted-foreground">{contest.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Judge:</span>
              <span className="text-muted-foreground">{contest.judge}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Block:</span>
              <span className="text-muted-foreground">{contest.blockTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Date:</span>
              <span className="text-muted-foreground">
                {new Date(contest.date).toLocaleString()}
              </span>
            </div>
            {contest.description && (
              <div className="mt-2">
                <span className="font-medium">Description:</span>
                <p className="text-muted-foreground mt-1">{contest.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contest</DialogTitle>
          </DialogHeader>
          <UpdateContestForm
            contest={contest}
            onSuccess={() => {
              setShowEditDialog(false);
              window.location.reload();
            }}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
} 
