"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateBlockSchema } from "@/lib/validation/training/updateBlocks";
import { updateBlock } from "./actions/_editBlock";
import { useToast } from "@/hooks/use-toast"

interface BlockFormProps {
  trainingId: number;
  blockNumber: number;
  initialData: z.infer<typeof updateBlockSchema>;
}

export function BlockForm({ trainingId, blockNumber, initialData }: BlockFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof updateBlockSchema>>({
    resolver: zodResolver(updateBlockSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: z.infer<typeof updateBlockSchema>) {
    const result = await updateBlock({
      trainingId,
      blockNumber,
      newBlockData: values,
    });

    if (result.success) {
      toast({
        title: "Success",
        description: "Block updated successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter block title" {...field} />
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
                <Textarea
                  placeholder="Enter block description"
                  className="min-h-[100px]"
                  {...field}
                />
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
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hidden"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Hidden</FormLabel>
                <div className="text-sm text-muted-foreground">
                  Hide this block from participants
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Update Block
        </Button>
      </form>
    </Form>
  );
}
