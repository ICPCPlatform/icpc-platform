import { z } from "zod";

const expectedBody = z.object({
  title: z.string(),
  description: z.string(),
  startDate: z.string().date(),
  duration: z.number(),
});

export default expectedBody;
