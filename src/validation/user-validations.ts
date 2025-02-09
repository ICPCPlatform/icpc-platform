import { z } from "zod";

const username = z
  .string()
  .trim()
  .min(3, { message: "Username too short" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  });

const password = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/, {
    message:
      "Password must be include an uppercase letter, a lowercase letter, a number, and a special character, with no spaces.",
  });

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

const phone = z
  .string()
  .trim()
  .regex(
    /^\+201[0-9]{9}$/,
    "Phone number must be a valid Egyptian number (starts with +20)"
  )
  .nullable();

export const user = z.object({
  username,
  password,
  gmail,
  cfHandle,
  phone,
});

// Usage example:
// const { success, data, error } = password.safeParse(""); // Replace with an actual 14-digit ID
// console.log("Valid Name:", success, data, error?.message);
