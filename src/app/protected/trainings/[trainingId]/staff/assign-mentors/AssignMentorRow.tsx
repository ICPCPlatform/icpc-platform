"use client";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { assignMentor } from "../mentors/actions/assignMentor";
import { unassignMentor } from "../mentors/actions/unassignMentor";
import { z } from "zod";
import { useState } from "react";

export function AssignMentorRow({ trainee, mentors, trainingId }: { trainee: any; mentors: any[]; trainingId: number }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const currentMentor = mentors.find(m => m.userId === trainee.mentorId);

  async function handleAssign(mentorId: string | null) {
    setError(null);
    setLoading(true);
    try {
      const schema = z.object({
        mentorId: z.string().uuid().nullable(),
        traineeId: z.string().uuid(),
        trainingId: z.number().int().positive(),
      });
      schema.parse({ mentorId, traineeId: trainee.userId, trainingId });
      if (mentorId) {
        await assignMentor({ mentorId, traineeId: trainee.userId, trainingId });
      } else {
        await unassignMentor({ traineeId: trainee.userId, trainingId });
      }
    } catch (e: any) {
      setError(e.message || "Failed to assign mentor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <tr>
      <td className="px-4 py-2 border">{trainee.username}</td>
      <td className="px-4 py-2 border">{currentMentor ? currentMentor.username : <span className="text-muted-foreground">Unassigned</span>}</td>
      <td className="px-4 py-2 border">
        <Select
          value={trainee.mentorId || "unassigned"}
          onValueChange={val => handleAssign(val === "unassigned" ? null : val)}
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
      </td>
    </tr>
  );
} 