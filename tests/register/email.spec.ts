import {test, expect} from '@playwright/test';
const password = "Cgmoreda@1";
const email = "cgmoredaAx@gmail.com";
const codeforcesHandle = "ElglalyY";
const confirmPassword = "Cgmoreda@1";
const phoneNumber = "+201036386402";
const username ="Sherif123"
const successMessage = "Registration successful. Please check your email for verification.";
import {

    invalidEmail,
    emailRequired,
    emailTooLong,
    unsupportedEmailDomain, userExist,

} from "@/lib/const/error-messages";

test.describe("Register Page Testing - Email Validation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/register");
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', confirmPassword);
        await page.locator('input[type="checkbox"]').check();
    });
    test("Test Case 8 – Valid Email Format", async ({ page }) => {
        // Fill out the registration form
        await page.fill('input[name="gmail"]', email);
        await page.click('button[type="submit"]');
        const successMessageElement = await page.waitForSelector(`text=${successMessage}`);
        expect(successMessageElement).not.toBeNull();
    });
    test("Test Case 9 – Invalid Email Format", async ({ page }) => {
        const EmailNotValid = "cgmoredax@gmail"; // Invalid email format

        // Fill out the registration form
        await page.fill('input[name="gmail"]', EmailNotValid);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${invalidEmail}`);
        expect(errorMessageElement).not.toBeNull()
    });

    test("Test Case 10 – Duplicate Email", async ({ page }) => {
        await page.fill('input[name="gmail"]', email);
        await page.click('button[type="submit"]');
        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${userExist}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(userExist);

        // Assert that the form data persists (except passwords)
        const persistedEmail = await page.inputValue('input[name="gmail"]');
        expect(persistedEmail).toBe(email);
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
