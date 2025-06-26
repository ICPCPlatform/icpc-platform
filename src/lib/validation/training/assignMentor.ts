import { z } from "zod";
import { username } from "../util";

export const assignMentorSchema = z
  .object({
    mentorUsername: username.describe(
      "The username of the mentor to be assigned to the trainee",
    ),
    traineeUsername: username.describe(
      "The username of the trainee to whom the mentor is being assigned",
    ),
    trainingId: z.coerce
      .number()
      .int()
      .positive()
      .describe(
        "The ID of the training session to which the mentor is being assigned",
      ),
  })
  .describe("Schema for assigning a mentor to a trainee in a training session");
