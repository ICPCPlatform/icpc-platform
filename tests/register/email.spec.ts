import {test, expect} from '@playwright/test';
const password = "Cgmoreda@1";
const email = "cgmoredax@gmail.com";
const codeforcesHandle = "Elglaly";
const confirmPassword = "Cgmoreda";
const phoneNumber = "+201026386402";
const username ="Sherif12"
const successMessage = "Registration successful. Please check your email for verification.";
import {

    invalidEmail,
    emailExist,
    emailRequired,
    emailTooLong,
    unsupportedEmailDomain,

} from "@/lib/const/error-messages";

// Email Tests
test.describe("Register Page Testing - Email Validation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/register");
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', confirmPassword);
    });

    test("Test Case 8 – Valid Email Format", async ({ page }) => {

        // Fill out the registration form
        await page.fill('input[name="gmail"]', email);
        await page.click('button[type="submit"]');

        // Wait for the success message to appear
        const successMessageElement = await page.waitForSelector(`text=${successMessage}`);
        const successMessageForm = await successMessageElement.textContent();

        // Assert the success message
        expect(successMessageForm).toBe(successMessage);

        // Assert the URL after successful registration
        await page.waitForURL("/profile");
        expect(page.url()).toContain("/profile");
    });
    test("Test Case 9 – Invalid Email Format", async ({ page }) => {
        const invalidEmail = "cgmoredax@gmail"; // Invalid email format

        // Fill out the registration form
        await page.fill('input[name="gmail"]', invalidEmail);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${invalidEmail}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(invalidEmail);

        // Assert that the form data persists (except passwords)
        const persistedEmail = await page.inputValue('input[name="gmail"]');
        expect(persistedEmail).toBe(invalidEmail);
    });

    test("Test Case 10 – Duplicate Email", async ({ page }) => {
        const duplicateEmail = "cgmoredax@gmail.com"; // Email already exists

        // Fill out the registration form
        await page.fill('input[name="gmail"]', duplicateEmail);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${emailExist}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(emailExist);

        // Assert that the form data persists (except passwords)
        const persistedEmail = await page.inputValue('input[name="gmail"]');
        expect(persistedEmail).toBe(duplicateEmail);
    });

    test("Test Case 11 – Email with Spaces", async ({ page }) => {
        const emailWithSpaces = "cgmoredax @gmail.com"; // Email with spaces

        // Fill out the registration form
        await page.fill('input[name="gmail"]', emailWithSpaces);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${invalidEmail}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(invalidEmail);

        // Assert that the form data persists (except passwords)
        const persistedEmail = await page.inputValue('input[name="gmail"]');
        expect(persistedEmail).toBe(emailWithSpaces);
    });

    test("Test Case 12 – Empty Email ", async ({ page }) => {

        // Fill out the registration form
        await page.fill('input[name="gmail"]', "");
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${emailRequired}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(emailRequired);

        // Assert that the form data persists (except passwords)
        const persistedEmail = await page.inputValue('input[name="gmail"]');
        expect(persistedEmail).toBe("");
    });

    test("Test Case 13 – Email too Long", async ({ page }) => {
        const longEmail = "cgmoredax".padEnd(100, "a")+"@gmail.com"; // Email with spaces

        // Fill out the registration form
        await page.fill('input[name="gmail"]', longEmail);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${emailTooLong}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(emailTooLong);

        // Assert that the form data persists (except passwords)
        const persistedEmail = await page.inputValue('input[name="gmail"]');
        expect(persistedEmail).toBe(longEmail);
    });

    test("Test Case 14 – Not Supported Email Domain", async ({ page }) => {
        const invalidEmail = "cgmoredax@mohamed.com"; // Email with spaces

        // Fill out the registration form
        await page.fill('input[name="gmail"]', invalidEmail);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${unsupportedEmailDomain}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(unsupportedEmailDomain);

        // Assert that the form data persists (except passwords)
        const persistedEmail = await page.inputValue('input[name="gmail"]');
        expect(persistedEmail).toBe(invalidEmail);
    });
});
