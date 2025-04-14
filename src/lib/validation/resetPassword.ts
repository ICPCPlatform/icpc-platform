import { z } from "zod";
import { password } from "./util";

/**
 * used in reset password
 */
export const resetPasswordValid = z.object({
  password,
  confirmPassword: password,
  token: z.string(),
});
