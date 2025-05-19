import zod from 'zod';
import { TRAINING_ERROR_MESSAGES } from '@/lib/const/training-error-messages';


export const trainingValidations = zod.object({
    title: zod.string()
        .min(5, TRAINING_ERROR_MESSAGES.TITLE_REQUIRED)
        .max(128, TRAINING_ERROR_MESSAGES.TITLE_TOO_LONG),

    description: zod.string()
        .min(15, TRAINING_ERROR_MESSAGES.DESCRIPTION_REQUIRED)
        .max(512, TRAINING_ERROR_MESSAGES.DESCRIPTION_TOO_LONG),

    startDate: zod.date()
        .min(new Date(), TRAINING_ERROR_MESSAGES.START_DATE_INVALID),

    duration: zod.number()
        .positive(TRAINING_ERROR_MESSAGES.DURATION_INVALID),

    status: zod.enum(["active" , "roadmap" , "private" , "over"]),

    headId : zod.string(),
    chiefJudge: zod.string(),
    deleted: zod.date().nullable().optional(),
});

export type TrainingFormData = zod.infer<typeof trainingValidations>;
