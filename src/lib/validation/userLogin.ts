import { z } from "zod";
import { gmail, password, username } from "./util";

/**
 * used in login page
 */
export const userLoginValid = z.object({
  usernameOrGmail: username.or(gmail),
  password,
});
