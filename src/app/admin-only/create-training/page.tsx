"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle } from "lucide-react";
import { createTrainingAction } from "./actions";
import { createTrainingSchema } from "@/lib/validation/training/createTraining";

// Create a client-side version of the schema

export default function CreateTrainingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Setup form
  const form = useForm<z.infer<typeof createTrainingSchema>>({
    resolver: zodResolver(createTrainingSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 1,
      status: "private",
    },
  });

  const onSubmit = async (values: z.infer<typeof createTrainingSchema>) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await createTrainingAction(values);

      if (result.success) {
        setSuccess("Training created successfully!");

        // Redirect to the training page if we have a training ID
      } else {
        setError(result.error || "Failed to create training");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Training</CardTitle>
          <CardDescription>
            Set up a new training program for your students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., ICPC Training 2023"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A unique name for the training program
                    </FormDescription>
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
                        placeholder="Describe the purpose and content of this training"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A brief description of what the training covers
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="headUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Head</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="UUID of the training head"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The username of the Head</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chiefJudgeUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chief Judge ID</FormLabel>
                    <FormControl>
                      <Input placeholder="UUID of the chief judge" {...field} />
                    </FormControl>
                    <FormDescription>
                      The username of the Cheif Judge
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) => {
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined,
                            );
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        When the training begins
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (weeks)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormDescription>
                        How many weeks the training will last
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {createTrainingSchema.shape.status._def.innerType._def.values.map(
                          (option) => (
                            <SelectItem key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The visibility status of this training
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Training"}
                </Button>
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-500 flex items-center">
                  <XCircle className="mr-2 h-5 w-5" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-md bg-green-50 text-green-500 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {success}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
