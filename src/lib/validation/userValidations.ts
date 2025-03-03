import { z } from "zod";
import { username, password, gmail, type EnforceKeys } from "./util";
import { Users } from "@/lib/db/schema/user/Users";
import { usernameTooShort, usernameInvalidFormat, phoneNumberTooShort, phoneNumberTooLong, phoneNumberInvalid, termsNotAccepted, passwordsMustMatch, invalidPassword } from "../const/error-messages";

// TODO CF Handle
const cfHandle = z
  .string()
  .trim()
  .min(3, { message: usernameTooShort })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: usernameInvalidFormat,
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
const confirmPassword = z.string().min(8, { message: invalidPassword });
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
}).refine((data) => data.password === data.confirmPassword, {
  message: passwordsMustMatch,
  path: ['confirmPassword'],
});

const _: EnforceKeys<typeof userRegisterValid, typeof Users> = {} as EnforceKeys<typeof userRegisterValid, typeof Users>; // Ensure validation matches Users schema

// Type checking is handled by TypeScript compiler
// Usage example:
// const { success, data, error } = password.safeParse("");
