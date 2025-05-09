import { z } from "zod";

export const updateMaterialSchema = z.array(
  z.object({
    title: z.string().min(1, { message: "Title is required" }),
    des: z.string().min(1, { message: "Description is required" }),
    link: z.string().url({ message: "Link must be a valid URL" }),
  }),
);
