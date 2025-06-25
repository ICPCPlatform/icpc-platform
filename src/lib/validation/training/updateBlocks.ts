import { z } from "zod";

export const updateBlockSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  date: z.string().date("Expected Date"),
  hidden: z.boolean(),
});
