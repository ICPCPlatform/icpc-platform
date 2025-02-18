import { z } from "zod";
import { username, password, type EnforceType } from "./util";
import { Users } from "@/lib/db/schema/user/Users";
const gmail = z
  .string()
  .trim()
  .email({ message: "Invalid gmail address" })
  .regex(/@gmail.com$/, { message: "Email must be a gmail account" });

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
  .regex(
    /^\+201[0-9]{9}$/,
    "Phone number must be a valid Egyptian number (starts with +20)",
  )
  .nullable();

const userRegisterValid = z.object({
  username,
  password,
  gmail,
  cfHandle,
  phoneNumber,
});
const _: EnforceType<typeof userRegisterValid.shape, typeof Users> =
  userRegisterValid.shape;

// Usage example:
// const { success, data, error } = password.safeParse(""); // Replace with an actual 14-digit ID
// console.log("Valid Name:", success, data, error?.message);
