import { z } from "zod";

export const unassignMentorSchema = z
  .object({
    mentorId: z.string().uuid().optional().describe(
      "The ID of the mentor to be unassigned from the trainee, or undefined if no specific mentor is being unassigned",
    ),
    traineeId: z.string().uuid().describe(
      "The ID of the trainee from whom the mentor is being unassigned",
    ),
    trainingId: z.coerce
      .number()
      .int()
      .positive()
      .describe(
        "The ID of the training session from which the mentor is being unassigned",
      ),
  })
  .describe("Schema for unassigning a mentor from a trainee in a training session");
