import {z} from "zod";
import {faculties, departments, country, validGovernorateCodes, universities} from "@/const";

// Academic 
const university = z.enum(universities);
const faculty = z.enum(faculties);
const department = z.enum(departments);
const academicYear = z.number({message:" Academic Year must be Number"})
    .positive({message:" Academic Year must be Positive"})
    .max(5,{message:" Academic Year must be between 1 and 5"}).optional();
const gradYear = z.string().date().optional();


// handles
//
// const vjudgeHandle = z.string().nullable();
// const atcoder = z.string().nullable();
// const topcoder = z.string().nullable();
// const spoj = z.string().nullable();
// const codechef = z.string().nullable();
// const csacademy = z.string().nullable();
// const cses = z.string().nullable();
const handle = z
    .string()
    .trim()
    .min(3, { message: "Username too short" })
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username must contain only letters, numbers, and underscores",
    }).optional();


// personal

const EnglishName = z
    .string()
    .trim()
    .min(3, {message: "too short"})
    .regex(/^[a-zA-Z]+$/)
    .optional();
const ArabicName = z
    .string()
    .trim()
    .min(2, {message: "too short"})
    .regex(/^[ء-ي]+$/)
    .optional();

const nationalId = z
    .string()
    .trim()
    .regex(/^\d{14}$/, "Egyptian National ID must be exactly 14 digits")
    .refine(birthdate, "Invalid birthdate encoded in ID")
    .refine(govNumber, "Invalid governorate code")
    .refine(() => {
        //TODO checksome
        return true;
    }, "Checksum validation failed").optional();

const countryName = z.enum(country);
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



export const userFullData = z.object({
    university,
    faculty,
    department,
    academicYear,
    gradYear,

    vjudgeHandle:handle,
    atcoder:handle,
    topcoder:handle,
    spoj:handle,
    codechef:handle,
    csacademy:handle,
    cses:handle,
    leetcode:handle,

    nameEnFirst: EnglishName,
    nameEnLast: EnglishName,
    NameAR1: ArabicName,
    NameAR2: ArabicName,
    NameAR3: ArabicName,
    NameAR4: ArabicName,

    nationalId,
    countryName,
    city,
    isMale,
    imageURL,

    facebook,
    linkedIn,
    twitter,
    github
});
