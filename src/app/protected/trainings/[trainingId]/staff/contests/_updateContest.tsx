"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateContestSchema } from "@/lib/validation/training/updateContest";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addContestAction as updateContestAction } from "./actions/updateContest";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

type Contest = {
  trainingId: number;
  blockNumber: number;
  contestId: string;
  judge: string;
  type: string;
  title: string;
  description: string;
  date: Date;
};

type UpdateContestFormProps = {
  contest: Contest;
  onSuccess: () => void;
  onCancel: () => void;
};

export function UpdateContestForm({ contest }: UpdateContestFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof updateContestSchema>>({
    resolver: zodResolver(updateContestSchema),
    defaultValues: {
      trainingId: contest.trainingId,
      blockNumber: contest.blockNumber,
      contestId: contest.contestId,
      type: contest.type as "contest" | "practice",
      title: contest.title,
      description: contest.description,
      date: new Date(contest.date),
    },
  });

  async function onSubmit(data: z.infer<typeof updateContestSchema>) {
    try {
      setIsLoading(true);
      await updateContestAction(data);
      toast({
        title: "Success",
        description: "Contest updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update contest",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contest type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="contest">Contest</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().slice(0, 16)
                      : field.value
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Contest"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
