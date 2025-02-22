import {test, expect} from '@playwright/test';
const password = "Cgmoreda@1";
const email = "cgmoredax@gmail.com";
const codeforcesHandle = "Elglaly";
const confirmPassword = "Cgmoreda";
const phoneNumber = "+201026386402";
const username ="Sherif12"
const successMessage = "Registration successful. Please check your email for verification.";
import {
    userExist,
    usernameRequired,
    invalidUsername,
    //TODO
    invalidCharacters,
    usernameContainsBannedWords,
} from "@/lib/const/error-messages";

//Username Tests
test.describe("Register Page Testing For Username", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/register");
        await page.fill('input[name="gmail"]', email);
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', confirmPassword);
         //await page.locator('input[name="termsAndConditions"]').check();
    });

    test("Test Case 1 – Valid Registration", async ({ page }) => {
        await page.fill('input[name="username"]', username);
        await page.click('button[type="submit"]');

        await page.waitForSelector(`text=${successMessage}`);
        expect(page.url()).toContain("/profile");
    });

    test("Test Case 2 – Shortest Username Registration", async ({ page }) => {
        const shortestUsername = "Shr";
        await page.fill('input[name="username"]', shortestUsername);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${invalidUsername}`);
        const errorMessage = await errorMessageElement.textContent();
        expect(errorMessage).toBe(invalidUsername);

        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(shortestUsername);
        expect(page.url()).toContain("/register");
    });

    //TODO : Bad word checlk

    // test("Test Case 2 – Shortest Username Registration", async ({ page }) => {
    //     const shortestUsername = "fuckbitches";
    //     await page.fill('input[name="username"]', shortestUsername);
    //     await page.click('button[type="submit"]');
    //     const errorMessageElement = await page.waitForSelector(`text=${invalidUsername}`);
    //     const errorMessage = await errorMessageElement.textContent();
    //     expect(errorMessage).toBe(invalidUsername);
    //
    //     const persistedEmail = await page.inputValue('input[name="username"]');
    //     expect(persistedEmail).toBe(shortestUsername);
    //     expect(page.url()).toContain("/register");
    // });

    test("Test Case 3 – Longest Username Registration", async ({ page }) => {
        const longestUsername = "Sherif123456789012345";
        await page.fill('input[name="username"]', longestUsername);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${invalidUsername}`);
        const errorMessage = await errorMessageElement.textContent();
        expect(errorMessage).toBe(invalidUsername);
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(longestUsername);
        expect(page.url()).toContain("/register");
    });

    test("Test Case 4 – Username with Spaces", async ({ page }) => {
        const usernameWithSpaces = "  Sherif12  ";
        await page.fill('input[name="username"]', usernameWithSpaces);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${invalidUsername}`);
        const errorMessage = await errorMessageElement.textContent();
        expect(errorMessage).toBe(invalidUsername);
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(usernameWithSpaces);
        expect(page.url()).toContain("/register");
    });

    test("Test Case 5 – Username with Special Characters", async ({ page }) => {
        const usernameWithSpecialChars = "Sherif_12!@";
        await page.fill('input[name="username"]', usernameWithSpecialChars);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${invalidUsername}`);
        const errorMessage = await errorMessageElement.textContent();
        expect(errorMessage).toBe(invalidUsername);
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(usernameWithSpecialChars);
        expect(page.url()).toContain("/register");
    });

    test("Test Case 6 – Mixed Case Username", async ({ page }) => {
        const mixedCaseUsername = "ShErIf12";
        await page.fill('input[name="username"]', mixedCaseUsername);
        await page.click('button[type="submit"]');
        await page.waitForSelector(`text=${successMessage}`);
        expect(page.url()).toContain("/profile");
    });

    test("Test Case 7 – Duplicate Username", async ({ page }) => {
        await page.fill('input[name="username"]', username);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${userExist}`);
        const errorMessage = await errorMessageElement.textContent();
        expect(errorMessage).toBe(userExist);
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(username);
        expect(page.url()).toContain("/register");
    });
    test("Test Case 8 – Empty Username", async ({ page }) => {
        await page.fill('input[name="username"]', '');
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${usernameRequired}`);
        const errorMessage = await errorMessageElement.textContent();
        expect(errorMessage).toBe(usernameRequired);
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe('');
        expect(page.url()).toContain("/register");
    });
});