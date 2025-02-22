// Username errors
const userExist: string = "Username already exists.";
const usernameRequired: string = "Username is required.";
const usernameContainsBannedWords: string = "Username contains banned words.";
const invalidUsername: string = "Invalid Username";

// Email errors
const invalidEmail: string = "Invalid email format.";
const emailExist: string = "Email already in use.";
const emailRequired: string = "Email is required.";
const emailTooLong: string = "Email too long.";
const unsupportedEmailDomain: string = "Unsupported email domain.";

// Password errors
const invalidPassword: string = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
const passwordRequired: string = "Password is required.";
const confirmPasswordRequired: string = "Confirm Password is required.";
const passwordMismatch: string = "Passwords do not match.";
const passwordExceedsMaxLength: string = "Password exceeds maximum length.";
const passwordContainsUsername = "Password cannot contain the username.";
const passwordContainsEmail = "Password cannot contain the email.";

// Codeforces Handle errors
const invalidCodeforces: string = "Invalid Codeforces handle.";
const codeforcesHandleRequired: string = "Codeforces Handle is required.";
const codeforcesHandleRequiredExist: string = "Phone number already in use.";
// Phone Number errors
const invalidPhoneNumber: string = "Invalid phone number.";
const phoneNumberRequired: string = "Phone Number is required.";
const phoneNumberExist: string = "Phone number already in use.";

// Terms and Conditions errors
const termsAndConditionsRequired: string = "You must accept the terms and conditions.";

// General errors
const invalidCharacters: string = "Invalid characters.";
const networkError : string = "Network Error occurred.";
export {
    userExist,
    usernameRequired,
    invalidUsername,
    usernameContainsBannedWords,
    invalidEmail,
    emailExist,
    emailRequired,
    emailTooLong,
    unsupportedEmailDomain,
    invalidPassword,
    passwordRequired,
    confirmPasswordRequired,
    passwordMismatch,
    passwordExceedsMaxLength,
    invalidCodeforces,
    codeforcesHandleRequired,
    codeforcesHandleRequiredExist,
    invalidPhoneNumber,
    phoneNumberRequired,
    phoneNumberExist,
    termsAndConditionsRequired,
    invalidCharacters,
    networkError,
    passwordContainsUsername,
    passwordContainsEmail

};
