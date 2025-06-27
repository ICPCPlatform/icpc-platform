"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addContestSchema } from "@/lib/validation/training/addContest";
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
import { addContestAction } from "./actions/addContest";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";

type AddContestFormProps = {
  trainingId: number;
  blocks: Array<{ blockNumber: number; title: string }>;
  onClose?: () => void;
};

export function AddContestForm({ trainingId, blocks, onClose }: AddContestFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof addContestSchema>>({
    resolver: zodResolver(addContestSchema),
    defaultValues: {
      trainingId,
      blockNumber: 1,
      type: "contest",
      title: "",
      description: "",
      date: new Date(),
    },
  });

  async function onSubmit(data: z.infer<typeof addContestSchema>) {
    startTransition(async () => {
      try {
        await addContestAction(data);
        toast({
          title: "Success",
          description: "Contest added successfully",
        });
        onClose?.();
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to add contest",
          variant: "destructive",
        });
      }
    });
  }

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="blockNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Block</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select contest type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {blocks.map((block) => (
                      <SelectItem
                        key={block.blockNumber}
                        value={block.blockNumber.toString()}
                      >
                        {block.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contestUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contest URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://codeforces.com/contest/123"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Button type="button" variant="outline" disabled={isPending} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add Contest"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
