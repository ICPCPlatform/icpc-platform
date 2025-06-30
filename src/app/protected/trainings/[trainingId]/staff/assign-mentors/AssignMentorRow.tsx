"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { assignMentor } from "../mentors/actions/assignMentor";
import { unassignMentor } from "../mentors/actions/unassignMentor";
import { useState, useTransition } from "react";
import { assignMentorSchema } from "@/lib/validation/training/assignMentorSchema";
import { TableCell, TableRow } from "@/components/ui/table";

export function AssignMentorRow({
  trainee,
  mentors,
  trainingId,
}: {
  trainee: {
    userId: string;
    username: string;
    mentorId: string | null;
  };
  mentors: {
    userId: string;
    username: string;
  }[];
  trainingId: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, startTransition] = useTransition();
  const currentMentor = mentors.find((m) => m.userId === trainee.mentorId);

  function handleAssign(mentorId: string | null) {
    startTransition(async () => {
      setError(null);
      try {
        if (mentorId) {
          assignMentorSchema.parse({
            mentorId,
            traineeId: trainee.userId,
            trainingId,
          });
          await assignMentor({
            mentorId,
            traineeId: trainee.userId,
            trainingId,
          });
        } else {
          await unassignMentor({ traineeId: trainee.userId, trainingId });
        }
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message || "Failed to assign mentor");
        } else {
          setError("An unexpected error occurred");
        }
      }
    });
  }

  return  (
    <TableRow>
      <TableCell>{trainee.username}</TableCell>
      <TableCell>
        {currentMentor ? (
          currentMentor.username
        ) : (
          <span className="text-muted-foreground">Unassigned</span>
        )}
      </TableCell>
      <TableCell>
        <Select
          value={trainee.mentorId || "unassigned"}
          onValueChange={(val) =>
            handleAssign(val === "unassigned" ? null : val)
          }
          disabled={loading}
        >
          <SelectTrigger className="w-40">
            {currentMentor ? currentMentor.username : "Select Mentor"}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {mentors.map((mentor) => (
              <SelectItem key={mentor.userId} value={mentor.userId}>
                {mentor.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
      </TableCell>
    </TableRow>
  );
}
