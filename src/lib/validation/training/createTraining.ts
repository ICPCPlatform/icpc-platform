import { z } from "zod";

export const createTrainingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(128, "Title must be less than 128 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(512, "Description must be less than 512 characters"),
  headId: z.string().uuid("Invalid head ID"),
  chiefJudge: z.string().uuid("Invalid chief judge ID"),
  startDate: z.date({ required_error: "Start date is required" }),
  duration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 week")
    .default(1),
  status: z.enum(["active", "roadmap", "private", "over"]).default("private"),
});
