import { z } from "zod";

export const updateMaterialSchema = z.array(
  z.object({
    title: z.string().trim().min(5, { message: "Title must be at least 5 characters" }),
    des: z.string().min(1, { message: "Description is required" }),
    link: z.string().url({ message: "Link must be a valid URL" }),
  }),
);
