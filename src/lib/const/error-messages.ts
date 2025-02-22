// Username errors
const errorMessageForUserExist: string = "Username already exists.";
const errorMessageForUsernameRequired: string = "Username is required.";
const errorMessageForUsernameContainsBannedWords: string = "Username contains banned words.";

// Email errors
const errorMessageForInvalidEmail: string = "Invalid email format.";
const errorMessageForEmailExist: string = "Email already in use.";
const errorMessageForSpaceEmail: string = "Email cannot contain spaces.";
const errorMessageForEmailRequired: string = "Email is required.";
const errorMessageForEmailTooLong: string = "Email too long.";
const errorMessageForUnsupportedEmailDomain: string = "Unsupported email domain.";

// Password errors
const errorMessageForPassword: string = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
const errorMessageForPasswordRequired: string = "Password is required.";
const errorMessageForConfirmPasswordRequired: string = "Confirm Password is required.";
const errorMessageForPasswordMismatch: string = "Passwords do not match.";
const errorMessageForPasswordExceedsMaxLength: string = "Password exceeds maximum length.";
const ErrorMessageForPasswordContainsUsername = "Password cannot contain the username.";
const ErrorMessageForPasswordContainsEmail = "Password cannot contain the email.";

// Codeforces Handle errors
const errorMessageForCodeforces: string = "Invalid Codeforces handle.";
const errorMessageForCodeforcesHandleRequired: string = "Codeforces Handle is required.";

// Phone Number errors
const errorMessageForPhoneNumber: string = "Invalid phone number.";
const errorMessageForPhoneNumberRequired: string = "Phone Number is required.";
const errorMessageForPhoneNumberExist: string = "Phone number already in use.";

// Terms and Conditions errors
const errorMessageForTermsAndConditionsRequired: string = "You must accept the terms and conditions.";

// General errors
const errorMessageForInvalidCharacters: string = "Invalid characters.";
const errorMessageForNetworkError : string = "Network Error occurred.";
const errorMessageForDuplicateSubmission: string = "Duplicate submission.";
const errorMessageForRateLimitExceeded: string = "Rate limit exceeded.";

export {
    errorMessageForUserExist,
    errorMessageForUsernameRequired,
    errorMessageForUsernameContainsBannedWords,
    errorMessageForInvalidEmail,
    errorMessageForEmailExist,
    errorMessageForSpaceEmail,
    errorMessageForEmailRequired,
    errorMessageForEmailTooLong,
    errorMessageForUnsupportedEmailDomain,
    errorMessageForPassword,
    errorMessageForPasswordRequired,
    errorMessageForConfirmPasswordRequired,
    errorMessageForPasswordMismatch,
    errorMessageForPasswordExceedsMaxLength,
    errorMessageForCodeforces,
    errorMessageForCodeforcesHandleRequired,
    errorMessageForPhoneNumber,
    errorMessageForPhoneNumberRequired,
    errorMessageForPhoneNumberExist,
    errorMessageForTermsAndConditionsRequired,
    errorMessageForInvalidCharacters,
    errorMessageForNetworkError,
    errorMessageForDuplicateSubmission,
    errorMessageForRateLimitExceeded,
    ErrorMessageForPasswordContainsUsername,
    ErrorMessageForPasswordContainsEmail

};
