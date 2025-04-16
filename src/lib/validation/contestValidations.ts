import { z } from 'zod';


export const contestSchema = z.object({
    title: z.string().min(3, 'Name is required').max(100, 'Name is too long'),
    description: z.string().min(5, 'Description is required').max(1000, 'Description is too long'),
    judge: z.string().min(3, 'Judge is required').max(100, 'Judge is too long'),
    type: z.enum(['individual', 'team'], {
        errorMap: () => ({ message: 'Type is required' }),
    }),
    pointSpp: z.number().positive().min(1, 'Points per submission must be at least 1'),
    firstPoints: z.number().positive().min(1, 'First points must be at least 1'),
    calcSystem:z.number().positive().min(1, 'Calculation system must be at least 1'),
    groupId: z.string().min(1, 'Group ID must be at least 1'),
});

export type ContestFormValues = z.infer<typeof contestSchema>;