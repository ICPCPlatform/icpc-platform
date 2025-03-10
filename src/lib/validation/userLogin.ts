import { z } from "zod";
import { gmail, password, username } from "./util";

export const userLoginValid = z.object({
  usernameOrGmail: username.or(
    gmail
  ),
  password,
});
