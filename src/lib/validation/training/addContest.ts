import { z } from 'zod';


export const addContestSchema = z.object({
  trainingId: z.number().int(),
  blockNumber: z.number().int(),
  contestUrl: z.string().url(),
  type: z.enum(["contest", "practice"]),
  title: z.string().min(1).max(128),
  description: z.string().max(512).optional(),
  date: z.date(),

});
