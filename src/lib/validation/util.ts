import { z } from "zod";
import { type AnyPgTable } from "drizzle-orm/pg-core";
import {
  errorMessageForInvalidEmail,
  errorMessageForPasswordExceedsMaxLength,
  errorMessageForPasswordRequired,
  errorMessageForShortPassword,
  errorMessageForUserExist,
} from "@/lib/const/error-messages";

export const username = z
  .string()
  .nonempty(errorMessageForUserExist)
  .trim()
  .min(3, { message: "Username too short" })
  .max(20, { message: "Username too long" })
  .regex(/^[a-zA-Z_][a-zA-Z0-9_]+$/, {
    message:
      "Username must contain only letters, numbers, and underscores and start with a letter or underscore",
  });

export const password = z
  .string()
  .nonempty(errorMessageForPasswordRequired)
  .min(8, { message: errorMessageForShortPassword })
  .max(100, { message: errorMessageForPasswordExceedsMaxLength })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/, {
    message:
      "Password must be include an uppercase letter, a lowercase letter, a number, and a special character, with no spaces.",
  });

export const gmail = z
  .string()
  .trim()
  .email({ message: errorMessageForInvalidEmail })
  .max(100, { message: "Email too long" })
  .regex(/@gmail.com$/, { message: "Email must be a gmail account" });

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
