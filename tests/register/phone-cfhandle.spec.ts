import {test, expect} from '@playwright/test';
const password = "Cgmoreda@1";
const email = "cgmoredax@gmail.com";
const codeforcesHandle = "Elglaly";
const confirmPassword = "Cgmoreda";
const phoneNumber = "+201026386402";
const username ="Sherif12"
const successMessage = "Registration successful. Please check your email for verification.";
import {
    invalidCodeforces,
    invalidPhoneNumber,
    phoneNumberRequired,
    phoneNumberExist,
    codeforcesHandleRequired,
    codeforcesHandleRequiredExist,

} from "@/lib/const/error-messages";

// Codeforeces Tests
test.describe("Register Page Testing - Codeforces Handle Validation", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/register");
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="gmail"]', email);
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', confirmPassword);
    });

    test("Test Case 12 – Valid Codeforces Handle", async ({ page }) => {

        // Fill out the registration form
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.click('button[type="submit"]');

        // Wait for the success message to appear
        const successMessageElement = await page.waitForSelector(`text=${successMessage}`);
        const successMessageForm = await successMessageElement.textContent();

        // Assert the success message
        expect(successMessageForm).toBe(successMessage);

        // Assert the URL after successful registration
        expect(page.url()).toContain("/profile");
    });

    test("Test Case 13 – Invalid Codeforces Handle", async ({ page }) => {
        const invalidCodeforcesHandle = "ELglaly@!"; // Invalid handle (contains special character)

        // Fill out the registration form
        await page.fill('input[name="cfHandle"]', invalidCodeforcesHandle);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${invalidCodeforces}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(invalidCodeforces);

        // Assert that the form data persists (except passwords)
        const persistedCodeforcesHandle = await page.inputValue('input[name="cfHandle"]');
        expect(persistedCodeforcesHandle).toBe(invalidCodeforcesHandle);

        // Assert that the form remains on the registration page
        expect(page.url()).toContain("/register");
    });

    test("Test Case 13 – Empty Codeforces Handle", async ({ page }) => {

        // Fill out the registration form
        await page.fill('input[name="cfHandle"]', "");
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${codeforcesHandleRequired}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(codeforcesHandleRequired);

        // Assert that the form data persists (except passwords)
        const persistedCodeforcesHandle = await page.inputValue('input[name="cfHandle"]');
        expect(persistedCodeforcesHandle).toBe("");

        // Assert that the form remains on the registration page
        expect(page.url()).toContain("/register");
    });
    test("Test Case 13 – Empty Codeforces Handle", async ({ page }) => {


        // Fill out the registration form
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${codeforcesHandleRequiredExist}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(codeforcesHandleRequiredExist);

        // Assert that the form data persists (except passwords)
        const persistedCodeforcesHandle = await page.inputValue('input[name="cfHandle"]');
        expect(persistedCodeforcesHandle).toBe(codeforcesHandle);

        // Assert that the form remains on the registration page
        expect(page.url()).toContain("/register");
    });
});
// PhoneNumber Tests
test.describe("Register Page Testing For Phone Number", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/register");
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="gmail"]', email);
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', confirmPassword);
        await page.locator('input[name="termsAndConditions"]').check();
    });

    test("Test Case 14 – Valid Phone Number", async ({ page }) => {
        const validPhoneNumber = "1234567890"; // Valid phone number

        // Fill out the registration form
        await page.fill('input[name="phoneNumber"]', validPhoneNumber);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${invalidPhoneNumber}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(invalidPhoneNumber);
        expect(page.url()).toContain("/profile");

    });

    test("Test Case 15 – Short Phone Number", async ({ page }) => {
        const shortPhoneNumber = "123456"; // Too short (less than 10 digits)

        // Fill out the registration form
        await page.fill('input[name="phoneNumber"]', shortPhoneNumber);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${invalidPhoneNumber}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(invalidPhoneNumber);
        const persistedPhone = await page.inputValue('input[name="phoneNumber"]');
        expect(persistedPhone).toBe(shortPhoneNumber);
        // Assert that the form remains on the registration page
        expect(page.url()).toContain("/register");
    });

    test("Test Case 16 – Empty Phone Number", async ({ page }) => {
        // Contains non-numeric characters

        await page.fill('input[name="phoneNumber"]', "");
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${phoneNumberRequired}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(phoneNumberRequired);
        const persistedPhone = await page.inputValue('input[name="phoneNumber"]');
        expect(persistedPhone).toBe("");
        // Assert that the form remains on the registration page
        expect(page.url()).toContain("/register");
    });

    test("Test Case 14 – Exist Phone Number", async ({ page }) => {

        // Fill out the registration form
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.click('button[type="submit"]');

        // Wait for the error message to appear
        const errorMessageElement = await page.waitForSelector(`text=${phoneNumberExist}`);
        const errorMessage = await errorMessageElement.textContent();

        // Assert the error message
        expect(errorMessage).toBe(phoneNumberExist);
        const persistedPhone = await page.inputValue('input[name="phoneNumber"]');
        expect(persistedPhone).toBe(phoneNumber);
        expect(page.url()).toContain("/profile");

    });

});
