import { z } from "zod";

export const addContestSchema = z.object({
  trainingId: z.number().int(),
  blockNumber: z.coerce
    .number()
    .int()
    .transform((val) => Number(val)),
  contestUrl: z.string().url(),
  type: z.enum(["contest", "practice"]),
  title: z.string().min(1).max(128),
  description: z.string().max(512).optional(),
  date: z.date(),
});
