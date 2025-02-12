import { z } from "zod";
import {
  faculties,
  departments,
  countries,
  validGovernorateCodes,
  universities,
} from "@/lib/const";

// Academic
const university = z.enum(universities).optional();
const faculty = z.enum(faculties).optional();
const department = z.enum(departments).optional();
const academicYear = z
  .number({ message: " Academic Year must be Number" })
  .positive({ message: " Academic Year must be Positive" })
  .max(5, { message: " Academic Year must be between 1 and 5" });
const graduationYear = z.string().date();


const handle = z
  .string()
  .trim()
  .min(3, { message: "Username too short" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username must contain only letters, numbers, and underscores",
  });

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

const nationalID = z
  .string()
  .trim()
  .regex(/^\d{14}$/, "Egyptian National ID must be exactly 14 digits")
  .refine(birthdate, "Invalid birthdate encoded in ID")
  .refine(govNumber, "Invalid governorate code")
  .refine(isValidEgyptianNIDChecksum, "Checksum validation failed");

const countryName = z.enum(countries).optional();
const city = z.string().optional();
const isMale = z.boolean().optional();
const imageURL = z.string().url().optional();

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

export const userFullData = z.object({
    university,
    faculty,
    department,
    academicYear,
    graduationYear,

    vjudge:handle,
    atcoder:handle,
    topcoder:handle,
    spoj:handle,
    codechef:handle,
    csacademy:handle,
    cses:handle,
    leetcode:handle,

    nameEnFirst: englishName,
    nameEnLast: englishName,
    nameAR1: arabicName,
    nameAR2: arabicName,
    nameAR3: arabicName,
    nameAR4: arabicName,

    nationalID,
    country: countryName,
    city,
    isMale,
    imageURL,

    facebook,
    linkedIn,
    twitter,
    github
});
