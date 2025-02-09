import { z, ZodError } from "zod";
import country from "@/const/country-list";
import validGovernorateCodes from "@/const/governorate-codes";

const gmail = z
  .string()
  .trim()
  .email({ message: "Invalid gmail address" })
  .regex(/@gmail.com$/, { message: "Email must be a gmail account" });
const EnglishName = z
  .string()
  .trim()
  .min(3, { message: "too short" })
  .regex(/^[a-zA-Z]+$/)
  .nullable();
const ArabicName = z
  .string()
  .trim()
  .min(2, { message: "too short" })
  .regex(/^[ء-ي]+$/)
  .nullable();
const password = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$/, {
    message:
      "Password must be include an uppercase letter, a lowercase letter, a number, and a special character, with no spaces.",
  });
const phone = z
  .string()
  .trim()
  .regex(
    /^\+201[0-9]{9}$/,
    "Phone number must be a valid Egyptian number (starts with +20)"
  )
  .nullable();
const nationalId = z
  .string()
  .trim()
  .regex(/^\d{14}$/, "Egyptian National ID must be exactly 14 digits")
  .refine(birthdate, "Invalid birthdate encoded in ID")
  .refine(govNumber, "Invalid governorate code")
  .refine((id) => {
    //TODO
    return true;

    const digits = id
      .split("")
      .map(Number)
      .map((d, idx, a) => {
        if (idx % 2 == 0) return d * 2;
        else return d;
      });
    console.log("Digits:", digits);
    const sum = digits.slice(0, 13).reduce((acc, d) => acc + d, 0);
    const expected = (10 - (sum % 10)) % 10;
    const actual = digits[0];
    console.log("Checksum validation:", sum, expected, actual);
    return expected === actual;
  }, "Checksum validation failed");

const countryName = z.enum(country);

// Usage example:

const { success, data, error } = password.safeParse(""); // Replace with an actual 14-digit ID
console.log("Valid Name:", success, data, error?.message);
function govNumber(id: string) {
  // Governorate code: digits 7 and 8 (0-indexed positions 7 and 8)
  const govCode = id.slice(7, 9);
  return validGovernorateCodes.includes(govCode);
}

function birthdate(id: string) {
  // Birthdate: digits 2-7 (0-indexed positions 2-7)
  // Determine century: first digit (assume '2' means 1900s, '3' means 2000s)
  const centuryDigit = id[0];
  if (centuryDigit !== "2" && centuryDigit !== "3") return false;
  const century = centuryDigit === "2" ? 1900 : 2000;

  // Parse birthdate: next 6 digits: YYMMDD
  const year = century + parseInt(id.slice(1, 3), 10);
  const month = parseInt(id.slice(3, 5), 10);
  const day = parseInt(id.slice(5, 7), 10);

  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() + 1 !== month ||
    birthDate.getDate() !== day
  ) {
    return false;
  }
  return true;
}
