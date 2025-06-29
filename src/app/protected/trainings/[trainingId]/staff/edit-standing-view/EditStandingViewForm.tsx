"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updateStandingView } from "./actions";
import type { StandingView } from "@/lib/db/schema/training/Trainings";
import { redirect, useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema (same as in actions.ts)
const standingViewSchema = z.object({
  trainingId: z.number().positive(),
  standingView: z.array(
    z.enum([
      "name",
      "cfHandle",
      "vjudge",
      "gmail",
      "level",
      "university",
      "faculty",
    ]),
  ),
});

type StandingViewFormValues = z.infer<typeof standingViewSchema>;

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

export default function EditStandingViewForm({
  initial,
  trainingId,
}: {
  initial: string[];
  trainingId: number;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<StandingViewFormValues>({
    resolver: zodResolver(standingViewSchema),
    defaultValues: {
      trainingId,
      standingView: initial as StandingView[],
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;
  const selected = watch("standingView");

  const onSubmit = async (data: StandingViewFormValues) => {
    setMessage(null);
    try {
      await updateStandingView(data);
      setMessage("Standing view updated.");
      router.push(`/protected/trainings/${trainingId}/leaderboard`);
    } catch (error) {
      if (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to update.",
        );
      }
    }
  };

  const handleToggle = (key: StandingView) => {
    const current = methods.getValues("standingView");
    if (current.includes(key)) {
      setValue(
        "standingView",
        current.filter((k) => k !== key),
      );
    } else {
      setValue("standingView", [...current, key]);
    }
  };

  const move = (from: number, to: number) => {
    setValue("standingView", reorder(selected, from, to));
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
          {message && (
            <div className="mb-4 text-sm text-green-600">{message}</div>
          )}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 font-semibold">
                Selected Columns (drag to reorder):
              </div>
              <ul className="mb-6">
                {selected.map((key, idx) => {
                  const col = ALL_COLUMNS.find((c) => c.key === key);
                  return (
                    <li key={key} className="flex items-center gap-2 mb-2">
                      <span className="w-40">{col?.label || key}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={idx === 0}
                        onClick={() => move(idx, idx - 1)}
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={idx === selected.length - 1}
                        onClick={() => move(idx, idx + 1)}
                      >
                        ↓
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleToggle(key as StandingView)}
                      >
                        Remove
                      </Button>
                    </li>
                  );
                })}
              </ul>
              <div className="mb-2 font-semibold">Available Columns:</div>
              <div className="grid grid-cols-2 gap-4">
                {ALL_COLUMNS.filter((col) => !selected.includes(col.key)).map(
                  (col) => (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        checked={false}
                        onCheckedChange={() => handleToggle(col.key)}
                        disabled={isSubmitting}
                      />
                      <span>{col.label}</span>
                    </label>
                  ),
                )}
              </div>
              {errors.standingView && (
                <div className="text-red-500">
                  {errors.standingView.message as string}
                </div>
              )}
              <CardFooter className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selected.length === 0}
                >
                  Save
                </Button>
              </CardFooter>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
