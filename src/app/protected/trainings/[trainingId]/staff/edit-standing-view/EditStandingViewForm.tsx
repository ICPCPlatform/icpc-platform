"use client";
import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updateStandingView } from "./actions";
import type { StandingView } from "@/lib/db/schema/training/Trainings";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { Form } from "@/components/ui/form";

// Zod validation schema for the form
const standingViewSchema = z.array(z.enum(["name", "cfHandle", "vjudge", "gmail", "level", "university", "faculty"]));

// Type-safe ALL_COLUMNS array that matches StandingView type
const ALL_COLUMNS: Array<{ key: StandingView; label: string }> = [
  { key: "name", label: "Name" },
  { key: "cfHandle", label: "Codeforces Handle" },
  { key: "vjudge", label: "Vjudge Handle" },
  { key: "gmail", label: "Gmail" },
  { key: "level", label: "Level" },
  { key: "university", label: "University" },
  { key: "faculty", label: "Faculty" },
];

function reorder<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

export default function EditStandingViewForm({ initial, trainingId }: { initial: string[]; trainingId: number }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleToggle = (key: string) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const move = (from: number, to: number) => {
    setSelected((prev) => reorder(prev, from, to));
  };

  const handleSave = () => {
    setMessage(null);
    
    // Validate the selected columns using Zod
    const validationResult = standingViewSchema.safeParse(selected);
    if (!validationResult.success) {
      setMessage("Invalid column selection. Please check your choices.");
      return;
    }

    startTransition(async () => {
      const res = await updateStandingView({
        trainingId,
        standingView: validationResult.data,
      });
      if (res.success) {
        setMessage("Standing view updated.");
        router.push(`/protected/trainings/${trainingId}/leaderboard`);
      } else {
        setMessage(res.error || "Failed to update.");
      }
    });
  };

  const handleCancel = () => {
    redirect(`/protected/trainings/${trainingId}/leaderboard`);
  };

  return (
    <div className="max-w-lg mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Standing View</CardTitle>
        </CardHeader>
        <CardContent>
          {message && <div className="mb-4 text-sm text-green-600">{message}</div>}
          <Form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="mb-4 font-semibold">Selected Columns (drag to reorder):</div>
            <ul className="mb-6">
              {selected.map((key, idx) => {
                const col = ALL_COLUMNS.find(c => c.key === key);
                return (
                  <li key={key} className="flex items-center gap-2 mb-2">
                    <span className="w-40">{col?.label || key}</span>
                    <Button type="button" size="sm" variant="outline" disabled={idx === 0} onClick={() => move(idx, idx - 1)}>
                      ↑
                    </Button>
                    <Button type="button" size="sm" variant="outline" disabled={idx === selected.length - 1} onClick={() => move(idx, idx + 1)}>
                      ↓
                    </Button>
                    <Button type="button" size="sm" variant="destructive" onClick={() => handleToggle(key)}>
                      Remove
                    </Button>
                  </li>
                );
              })}
            </ul>
            <div className="mb-2 font-semibold">Available Columns:</div>
            <div className="grid grid-cols-2 gap-4">
              {ALL_COLUMNS.filter(col => !selected.includes(col.key)).map((col) => (
                <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={false}
                    onCheckedChange={() => handleToggle(col.key)}
                    disabled={isPending}
                  />
                  <span>{col.label}</span>
                </label>
              ))}
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={handleCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending || selected.length === 0}>
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 