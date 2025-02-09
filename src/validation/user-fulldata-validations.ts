import { z, ZodError } from "zod";
import country from "@/const/country-list";
import validGovernorateCodes from "@/const/governorate-codes";
import Facebook from "next-auth/providers/facebook";
import LinkedIn from "next-auth/providers/linkedin";
import Twitter from "next-auth/providers/twitter";


// Academic 
const university = z.string().nullable();
const faculty = z.string().nullable();
const department = z.string().nullable();
const academicYear = z.string().nullable();
const gradYear = z.string().nullable();


// handles

const vjudgeHandle = z.string().nullable();
const atcoder = z.string().nullable();
const topcoder = z.string().nullable();
const spoj = z.string().nullable();
const codechef = z.string().nullable();
const csacademy = z.string().nullable();
const cses = z.string().nullable();
const leetcode = z.string().nullable();


// personal

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

  const nationalId = z
  .string()
  .trim()
  .regex(/^\d{14}$/, "Egyptian National ID must be exactly 14 digits")
  .refine(birthdate, "Invalid birthdate encoded in ID")
  .refine(govNumber, "Invalid governorate code")
  .refine((id) => {
    //TODO checksome
    return true;
  }, "Checksum validation failed");

const countryName = z.enum(country);
const city = z.string().nullable();
const dateOfBirth = z.string().nullable();
const isMale = z.boolean().nullable();
const imageURL = z.string().nullable();

const facebook = z.string().nullable();
const linkedIn = z.string().nullable();
const github = z.string().nullable();
const twitter = z.string().nullable();



const userFullData = z.object({
    university,
    faculty,
    department,
    academicYear,
    gradYear,

    vjudgeHandle,
    atcoder,
    topcoder,
    spoj,
    codechef,
    csacademy,
    cses,
    leetcode,
    
    nameEnFirst: EnglishName,
    nameEnLast: EnglishName,
    NameAR1:ArabicName,
    NameAR2:ArabicName,
    NameAR3:ArabicName,
    NameAR4:ArabicName,
    nationalId,
    countryName,
    city,
    dateOfBirth,
    isMale,
    imageURL,

    facebook,
    linkedIn,
    twitter,
    github


});






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