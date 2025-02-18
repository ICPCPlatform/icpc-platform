import { z } from "zod";

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

export type EnforceType<T, Expected> = keyof T extends keyof Expected
  ? T
  : never;
