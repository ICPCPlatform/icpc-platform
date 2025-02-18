import { z } from "zod";
import { UsersFullData } from "@/lib/db/schema/user/UsersFullData";
import { validGovernorateCodes } from "@/lib/const";
import { type EnforceKeys } from "./util";

// Academic

// don't touch this
const academicYear = z
  .string()
  .trim()
  .regex(/^[1-7]$/, {
    message: "Academic Year must be a number between 1 and 7",
  })
  .transform((value) => Number(value))
  .or(
    z
      .number({ message: " Academic Year must be Number" })
      .positive({ message: " Academic Year must be Positive" })
      .max(7, { message: " Academic Year must be between 1 and 5" }),
  )
  .optional();
const graduationDate = z.string().date().optional();

const handle = z
  .string()
  .trim()
  .min(3, { message: "Username too short" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  })
  .optional();

// personal

const englishName = z
  .string()
  .trim()
  .min(3, { message: "too short" })
  .regex(/^[a-zA-Z]+$/)
  .optional();
const arabicName = z
  .string()
  .trim()
  .min(2, { message: "too short" })
  .regex(/^[ء-ي]+$/)
  .optional();

const nationalId = z
  .string()
  .trim()
  .regex(/^\d{14}$/, "Egyptian National ID must be exactly 14 digits")
  .refine(birthdate, "Invalid National ID")
  .refine(govNumber, "Invalid National ID")
  .refine(isValidEgyptianNIDChecksum, "Invalid National ID")
  .optional();

const isMale = z.boolean().optional();
const imageUrl = z.string().url().optional();

const facebook = z.string().url().optional();
const linkedIn = z.string().url().optional();
const github = z.string().url().optional();
const twitter = z.string().url().optional();

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

function isValidEgyptianNIDChecksum(id: string) {
  const weights = [2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const payload = id.slice(0, 13);
  const givenCheckDigit = parseInt(id.slice(13), 10);

  let sum = 0;
  for (let i = 0; i < payload.length; i++) {
    sum += parseInt(payload[i], 10) * weights[i];
  }

  // Compute remainder mod 11
  const remainder = sum % 11;
  let expectedCheckDigit = 11 - remainder;

  // If the result is 10 or 11, then the check digit is 0.
  if (expectedCheckDigit === 10 || expectedCheckDigit === 11) {
    expectedCheckDigit = 0;
  }

  return expectedCheckDigit === givenCheckDigit;
}
const id = z.number().positive().int().optional();

const userFullDataValid = z.object({
  instituteId: id,
  facultyId: id,
  departmentId: id,
  academicYear,
  graduationDate,

  atcoder: handle,
  codechef: handle,
  cses: handle,
  leetcode: handle,

  firstNameEn: englishName,
  lastNameEn: englishName,
  nameAR1: arabicName,
  nameAR2: arabicName,
  nameAR3: arabicName,
  nameAR4: arabicName,

  nationalId,
  countryId: id,
  cityId: id,
  isMale,
  imageUrl,

  facebook,
  linkedIn,
  twitter,
  github,
  visibilityMask: z.number().int().optional(),
});

const _: EnforceKeys<typeof userFullDataValid, typeof UsersFullData> = true;

export { userFullDataValid };
