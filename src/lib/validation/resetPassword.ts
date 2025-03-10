import { z } from "zod";
import { password } from "./util";

export const resetPasswordValid = z
  .object({
    password,
    confirmPassword: password,
    token: z.string(),
  });
