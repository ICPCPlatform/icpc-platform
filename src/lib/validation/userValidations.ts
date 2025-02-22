import { z } from "zod";
import { username, password, gmail, type EnforceKeys } from "./util";
import { Users } from "@/lib/db/schema/user/Users";
import { usernameTooShort, usernameInvalidCharacters, phoneNumberTooShort, phoneNumberTooLong, phoneNumberInvalid, termsNotAccepted } from "../const/error-messages";

// TODO CF Handle
const cfHandle = z
  .string()
  .trim()
  .min(3, { message: usernameTooShort })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: usernameInvalidCharacters,
  });

const phoneNumber = z
  .string()
  .trim()
  .min(13, { message: phoneNumberTooShort })
  .max(15, { message: phoneNumberTooLong })
  .regex(
    /^\+201[0-9]{9}$/,
    phoneNumberInvalid,
  );
const confirmPassword =z.string();
const termsAccepted = z.boolean().refine((val) => val === true, {
  message: termsNotAccepted
});

export const userRegisterValid = z.object({
  username,
  password,
  gmail,
  cfHandle,
  vjHandle: cfHandle.optional(),
  phoneNumber,
  confirmPassword,
  termsAccepted,
});

// Type checking is handled by TypeScript compiler
// Usage example:
// const { success, data, error } = password.safeParse("");
