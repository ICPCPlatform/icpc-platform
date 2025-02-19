import { z } from "zod";
import { type AnyPgTable } from "drizzle-orm/pg-core";

export const username = z
  .string()
  .trim()
  .min(3, { message: "Username too short" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  });

export const password = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/, {
    message:
      "Password must be include an uppercase letter, a lowercase letter, a number, and a special character, with no spaces.",
  });

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
