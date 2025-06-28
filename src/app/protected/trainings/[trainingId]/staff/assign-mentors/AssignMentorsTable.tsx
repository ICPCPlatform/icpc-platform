"use client";
import { useState, useTransition, useRef } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";

interface Mentor {
  userId: string;
  username: string;
  gmail: string;
}
interface Trainee {
  userId: string;
  mentorId: string;
  username: string;
  gmail: string;
}

export default function AssignMentorsTable({ trainees, mentors, trainingId }: { trainees: Trainee[]; mentors: Mentor[]; trainingId: number; }) {
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkMentor, setBulkMentor] = useState<string | null>(null);
  const lastClickedIndex = useRef<number | null>(null);

  function toggleSelect(userId: string, index: number, shiftKey: boolean) {
    if (shiftKey && lastClickedIndex.current !== null) {
      const start = Math.min(lastClickedIndex.current, index);
      const end = Math.max(lastClickedIndex.current, index);
      const rangeIds = trainees.slice(start, end + 1).map(t => t.userId);
      setSelected(prev => Array.from(new Set([...prev, ...rangeIds])));
    } else {
      setSelected((prev) => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
    }
    lastClickedIndex.current = index;
  }
  function selectAll() {
    setSelected(trainees.map(t => t.userId));
  }
  function clearAll() {
    setSelected([]);
  }

  async function handleAssign(traineeId: string, mentorId: string) {
    startTransition(async () => {
      await fetch(`/protected/trainings/${trainingId}/staff/assign-mentors/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traineeId, mentorId }),
      });
      window.location.reload();
    });
  }

  async function handleBulkAssign() {
    if (!bulkMentor) return;
    const mentorId = bulkMentor;
    startTransition(async () => {
      await Promise.all(selected.map(traineeId =>
        fetch(`/protected/trainings/${trainingId}/staff/assign-mentors/assign`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ traineeId, mentorId }),
        })
      ));
      window.location.reload();
    });
  }

  return (
    <CardContent>
      <div className="mb-2 flex items-center gap-2">
        <button className="btn btn-xs border px-2 py-1 rounded" onClick={selectAll} disabled={isPending}>Select All</button>
        <button className="btn btn-xs border px-2 py-1 rounded" onClick={clearAll} disabled={isPending}>Clear</button>
        {selected.length > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <span>Bulk assign to:</span>
            <Select
              value={bulkMentor ?? undefined}
              onValueChange={setBulkMentor}
              disabled={isPending}
            >
              <SelectTrigger className="w-40">{bulkMentor ? mentors.find(m => m.userId === bulkMentor)?.username : "Select Mentor"}</SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {mentors.map((mentor) => (
                  <SelectItem key={mentor.userId} value={mentor.userId}>
                    {mentor.username} <span className="text-xs text-muted-foreground">({mentor.gmail})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button className="btn btn-xs border px-2 py-1 rounded bg-primary text-primary-foreground" onClick={handleBulkAssign} disabled={isPending || !bulkMentor}>Apply</button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="px-2 py-2 border"><input type="checkbox" checked={selected.length === trainees.length && trainees.length > 0} onChange={e => e.target.checked ? selectAll() : clearAll()} /></th>
              <th className="px-4 py-2 border">Trainee</th>
              <th className="px-4 py-2 border">Current Mentor</th>
              <th className="px-4 py-2 border">Assign Mentor</th>
            </tr>
          </thead>
          <tbody>
            {trainees.map((trainee, idx) => (
              <tr key={trainee.userId} className={selected.includes(trainee.userId) ? "bg-muted" : ""}>
                <td className="px-2 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(trainee.userId)}
                    onClick={e => toggleSelect(trainee.userId, idx, e.shiftKey)}
                    readOnly
                  />
                </td>
                <td className="px-4 py-2 border">{trainee.username} <span className="text-xs text-muted-foreground">({trainee.gmail})</span></td>
                <td className="px-4 py-2 border">
                  {mentors.find(m => m.userId === trainee.mentorId)?.username || <span className="text-muted-foreground">Unassigned</span>}
                </td>
                <td className="px-4 py-2 border">
                  <Select
                    name="mentorId"
                    defaultValue={trainee.mentorId || undefined}
                    onValueChange={mentorId => handleAssign(trainee.userId, mentorId)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-40">
                      {mentors.find(m => m.userId === trainee.mentorId)?.username || "Select Mentor"}
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {mentors.map((mentor) => (
                        <SelectItem key={mentor.userId} value={mentor.userId}>
                          {mentor.username} <span className="text-xs text-muted-foreground">({mentor.gmail})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  );
} 