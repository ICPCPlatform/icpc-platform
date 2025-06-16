import zod from 'zod';
import { BLOCK_ERROR_MESSAGES } from '@/lib/const/block-error-messages';
export const blockValidations = zod.object({
    title: zod.string().min(1, BLOCK_ERROR_MESSAGES.TITLE_REQUIRED).max(128, BLOCK_ERROR_MESSAGES.TITLE_TOO_LONG),
    description: zod.string().min(1, BLOCK_ERROR_MESSAGES.DESCRIPTION_REQUIRED).max(512, BLOCK_ERROR_MESSAGES.DESCRIPTION_TOO_LONG),
    date: zod.date().min(new Date(), BLOCK_ERROR_MESSAGES.DATE_INVALID),
    hidden: zod.boolean(),
})

export type BlockFormData = zod.infer<typeof blockValidations>