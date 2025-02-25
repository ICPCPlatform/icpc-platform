// Username errors
const userExist: string = "User already exists";
const usernameRequired: string = "Username is required.";
const usernameContainsBannedWords: string = "Username contains banned words.";
const usernameTooShort: string = "Username too short.";
const usernameInvalidFormat: string = "Username must contain only letters, numbers, and underscores.";
const usernameTooLong = "Username too long";

// Email errors
const invalidEmail: string = "Invalid email format.";
const emailExist: string = "Email already in use.";
const emailRequired: string = "Email is required.";
const emailTooLong = "Email too long";
const unsupportedEmailDomain: string = "Unsupported email domain.";

// Password errors
const invalidPassword: string = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
const passwordRequired: string = "Password is required.";
const confirmPasswordRequired: string = "Confirm Password is required.";
const passwordExceedsMaxLength: string = "Password exceeds maximum length.";
const passwordContainsUsername = "Password cannot contain the username.";
const passwordContainsEmail = "Password cannot contain the email.";
const passwordInvalidFormat = "Password must include an uppercase letter, a lowercase letter, a number, and a special character, with no spaces.";
const passwordsMustMatch: string = "Passwords must match.";
const passwordMinLength: string = "Password must be at least 8 characters long.";

// Codeforces Handle errors
const invalidCodeforces: string = "Invalid Codeforces handle.";
const codeforcesHandleRequired: string = "Codeforces Handle is required.";
const codeforcesHandleRequiredExist: string = "Phone number already in use.";

// Phone Number errors
const invalidPhoneNumber: string = "Invalid phone number.";
const phoneNumberRequired: string = "Phone Number is required.";
const phoneNumberExist: string = "Phone number already in use.";
const phoneNumberTooShort: string = "Phone number too short.";
const phoneNumberTooLong: string = "Phone number too long.";
const phoneNumberInvalid: string = "Phone number must be a valid Egyptian number (starts with +20).";

// Terms and Conditions errors
const termsNotAccepted: string = "You must agree to the terms of service.";

// General errors
const invalidCharacters: string = "Invalid characters.";
const networkError : string = "Network Error occurred.";

// UserFulldataValidations errors
const academicYearInvalid = "Academic Year must be a number between 1 and 7";
const academicYearNotNumber = "Academic Year must be Number";
const academicYearNotPositive = "Academic Year must be Positive";
const academicYearOutOfRange = "Academic Year must be between 1 and 5";
const englishNameTooShort = "too short";
const englishNameInvalid = "Name must contain only letters";
const arabicNameTooShort = "too short";
const arabicNameInvalid = "Name must contain only Arabic letters";
const nationalIdInvalidLength = "Egyptian National ID must be exactly 14 digits";
const nationalIdInvalid = "Invalid National ID";

const successMessage = "Registration successful. Please check your email for verification.";

export {
    userExist,
    usernameRequired,
    usernameInvalidFormat,
    usernameContainsBannedWords,
    usernameTooShort,
    invalidEmail,
    emailExist,
    emailRequired,
    emailTooLong,
    unsupportedEmailDomain,
    invalidPassword,
    passwordRequired,
    confirmPasswordRequired,
    passwordExceedsMaxLength,
    invalidCodeforces,
    codeforcesHandleRequired,
    codeforcesHandleRequiredExist,
    invalidPhoneNumber,
    phoneNumberRequired,
    phoneNumberExist,
    phoneNumberTooShort,
    phoneNumberTooLong,
    phoneNumberInvalid,
    termsNotAccepted,
    invalidCharacters,
    networkError,
    passwordContainsUsername,
    passwordContainsEmail,
    academicYearInvalid,
    academicYearNotNumber,
    academicYearNotPositive,
    academicYearOutOfRange,
    englishNameTooShort,
    englishNameInvalid,
    arabicNameTooShort,
    arabicNameInvalid,
    nationalIdInvalidLength,
    nationalIdInvalid,
    usernameTooLong,
    passwordInvalidFormat,
    passwordsMustMatch,
    passwordMinLength,
    successMessage
};
