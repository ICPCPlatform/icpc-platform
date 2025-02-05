import { z } from "zod";

const expectedBody = z.object({
  username: z.string(),
  password: z.string(),
  gmail: z
    .string()
    .email()
    .regex(/@gmail.com$/),
  phoneNumber: z
    .string()
    .min(11)
    .max(11)
    .regex(/^01\d+$/),
  cfHandle: z.string(),
});

export default expectedBody;
