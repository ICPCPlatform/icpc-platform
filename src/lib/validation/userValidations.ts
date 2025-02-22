import { z } from "zod";
import { username, password, type EnforceKeys } from "./util";
import { Users } from "@/lib/db/schema/user/Users";
import { gmail } from "./util";

// TODO CF Handle
const cfHandle = z
  .string()
  .trim()
  .min(3, { message: "Username too short" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  });

const phoneNumber = z
  .string()
  .trim()
  .min(13, { message: "Phone number too short" })
  .max(15, { message: "Phone number too long" })
  .regex(
    /^\+201[0-9]{9}$/,
    "Phone number must be a valid Egyptian number (starts with +20)",
  );
const confirmPassword =z.string();
export const userRegisterValid = z.object({
  username,
  password,
  gmail,
  cfHandle,
  vjHandle: cfHandle.optional(),
  phoneNumber,
  confirmPassword,
});
const _: EnforceKeys<typeof userRegisterValid, typeof Users> = true;

// Usage example:
// const { success, data, error } = password.safeParse(""); // Replace with an actual 14-digit ID
// console.log("Valid Name:", success, data, error?.message);
