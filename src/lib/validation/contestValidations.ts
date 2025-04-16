

import { z } from 'zod';
import { CONTEST_ERROR_MESSAGES } from '@/lib/const/contest-error-messages';

export const contestValidations = z.object({
  groupId: z.string().min(1,CONTEST_ERROR_MESSAGES.GROUP_ID_REQUIRED).max(32, CONTEST_ERROR_MESSAGES.GROUP_ID_TOO_LONG).nullable(),
  judge: z.string().min(1, CONTEST_ERROR_MESSAGES.JUDGE_REQUIRED).max(32, CONTEST_ERROR_MESSAGES.JUDGE_TOO_LONG),
  title: z.string().min(1, CONTEST_ERROR_MESSAGES.TITLE_REQUIRED).max(128, CONTEST_ERROR_MESSAGES.TITLE_TOO_LONG),
  description: z.string().min(1, CONTEST_ERROR_MESSAGES.DESCRIPTION_REQUIRED).max(512, CONTEST_ERROR_MESSAGES.DESCRIPTION_TOO_LONG),
  type: z.enum(['practice', 'contest'], {
    errorMap: () => ({ message: CONTEST_ERROR_MESSAGES.TYPE_INVALID }),
  }).nullable(),
  pointPerProblem: z.number().int().positive().min(1, CONTEST_ERROR_MESSAGES.POINTSPP_INVALID).default(20),
  firstPoints: z.number().int().positive().min(1, CONTEST_ERROR_MESSAGES.FIRST_POINTS_INVALID).default(1000),
  calcSys: z.string().min(1, CONTEST_ERROR_MESSAGES.CALC_SYSTEM_REQUIRED).max(32, CONTEST_ERROR_MESSAGES.CALC_SYSTEM_TOO_LONG).default('90%'),
});

export type ContestFormValues = z.infer<typeof contestValidations>;
