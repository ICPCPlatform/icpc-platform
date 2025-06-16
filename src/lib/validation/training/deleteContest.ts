import { z } from 'zod';


export const deleteContestSchema = z.object({
  trainingId: z.number().int(),
  blockNumber: z.number().int(),
  contestId: z.string().min(1).max(32),
});
