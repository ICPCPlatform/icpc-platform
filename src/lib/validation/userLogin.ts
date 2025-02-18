import { z } from "zod";
import { password, username } from "./util";




export const userLoginValid = z.object({
  username,
  password
})
