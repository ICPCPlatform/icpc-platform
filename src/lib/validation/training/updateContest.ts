import { z } from "zod";

export const updateContestSchema = z.object({
  trainingId: z.number().int(),
  blockNumber: z.number().int(),
  contestId: z.string(),
  type: z.enum(["contest", "practice"]).optional(),
  title: z.string().min(1).max(128).optional(),
  description: z.string().max(512).optional(),
  date: z.date().optional(),
});
