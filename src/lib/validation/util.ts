import { z } from "zod";
import { type AnyPgTable } from "drizzle-orm/pg-core";
import {
  invalidEmail,
  passwordExceedsMaxLength,
  invalidPassword,
  passwordRequired,
  userExist,
  usernameTooShort,
  usernameTooLong,
  usernameInvalidFormat,
  passwordInvalidFormat,
  emailTooLong,
  emailNotGmail
} from "../const/error-messages";

export const username = z
  .string()
  .nonempty(userExist)
  .trim()
  .min(3, { message: usernameTooShort })
  .max(20, { message: usernameTooLong })
  .regex(/^[a-zA-Z_][a-zA-Z0-9_]+$/, {
    message: usernameInvalidFormat,
  });

export const password = z
  .string()
  .nonempty(passwordRequired)
  .min(8, { message: invalidPassword })
  .max(100, { message: passwordExceedsMaxLength })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/, {
    message: passwordInvalidFormat,
  });

export const gmail = z
  .string()
  .trim()
  .email({ message: invalidEmail })
  .max(100, { message: emailTooLong })
  .regex(/@gmail.com$/, { message: emailNotGmail });

/**
 * check if the keys of the zod object are the same as the keys of the pgTable
 * @param T - zod object
 * @param Expected - pgTable
 *
 * how to use
 * @example
 * const _: EnforceKeys<typeof userFullDataValid, typeof UsersFullData> = true;
 * */
export type EnforceKeys<
  T extends z.ZodTypeAny,
  Expected extends AnyPgTable,
> = keyof z.infer<T> extends keyof Expected["$inferInsert"] ? true : never;
