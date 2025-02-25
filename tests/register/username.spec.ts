import {test, expect} from '@playwright/test';
const password = "Cgmoreda@1";
const email = "cgmoredax@gmail.com";
const codeforcesHandle = "Elglaly";
const confirmPassword = "Cgmoreda@1";
const phoneNumber = "+201026386402";
const username ="Sherif12"
import {
    userExist,
    usernameRequired,
    usernameInvalidFormat,
    usernameTooShort,
    usernameTooLong,
    successMessage
    //TODO
    //usernameContainsBannedWords,
} from "@/lib/const/error-messages";

//Username Tests
test.describe("Register Page Testing For Username", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3001/register");
        await page.fill('input[name="gmail"]', email);
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', confirmPassword);
        await page.locator('input[type="checkbox"]').check();
    });

    test("Test Case 1 – Username Exists", async ({ page }) => {

        await page.fill('input[name="username"]', username);
        const [response] = await Promise.all([
            page.waitForResponse(response => response.url().includes("/api/auth/register")),
            page.click('button[type="submit"]'),
        ]);

        // Check the API response status
        expect(response.status()).toBe(400); // Ensure the status code is 400 (Bad Request)

        const successMessageElement = await page.waitForSelector(`text=${userExist}`, { state: "visible" });
        expect(successMessageElement).not.toBeNull();
    });

    test("Test Case 2 – Shortest Username Registration", async ({ page }) => {
        const shortestUsername = "Sh";
        await page.fill('input[name="username"]', shortestUsername);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${usernameTooShort}`);
        expect(errorMessageElement).not.toBeNull();

        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(shortestUsername);
        expect(page.url()).toContain("/register");
    });

    //TODO : Bad word check

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
        const longestUsername = "Sherif"+"A".padEnd(20, "A");
        await page.fill('input[name="username"]', longestUsername);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${usernameTooLong}`);
        expect(errorMessageElement).not.toBeNull();
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(longestUsername);
        expect(page.url()).toContain("/register");
    });

    test("Test Case 4 – Username with Spaces", async ({ page }) => {
        // TODO : check that the username is trimmed in Database
        const usernameWithSpaces = "  Sherif12  ";
        await page.fill('input[name="username"]', usernameWithSpaces);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${successMessage}`);
        expect(errorMessageElement).not.toBeNull();
        expect(page.url()).toContain("/register");
    });

    test("Test Case 5 – Username with Special Characters", async ({ page }) => {
        const usernameWithSpecialChars = "Sherif_12!@";
        await page.fill('input[name="username"]', usernameWithSpecialChars);
        await page.click('button[type="submit"]');

        const errorMessageElement = await page.waitForSelector(`text=${usernameInvalidFormat}`);
        expect(errorMessageElement).not.toBeNull();
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(usernameWithSpecialChars);
        expect(page.url()).toContain("/register");
    });

    test("Test Case 6 – Mixed Case Username", async ({ page }) => {
        const mixedCaseUsername = "ShErIf12";
        await page.fill('input[name="username"]', mixedCaseUsername);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${successMessage}`);
        expect(errorMessageElement).not.toBeNull();
        expect(page.url()).toContain("/profile");
    });

    test("Test Case 7 – Valid Username", async ({ page }) => {
        await page.fill('input[name="username"]', username);
        const [response] = await Promise.all([
            page.waitForResponse(response => response.url().includes("/api/auth/register")),
            page.click('button[type="submit"]'),
        ]);
        expect(response.status()).toBe(200)

        const errorMessageElement = await page.waitForSelector(`text=${userExist}`);
        expect(errorMessageElement).not.toBeNull();
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe(username);
        expect(page.url()).toContain("/register");
    });
    test("Test Case 8 – Empty Username", async ({ page }) => {

        page.click('button[type="submit"]')
        const errorMessageElement = await page.waitForSelector(`text=${usernameRequired}`);
        expect(errorMessageElement).not.toBeNull();
        const persistedEmail = await page.inputValue('input[name="username"]');
        expect(persistedEmail).toBe('');
        expect(page.url()).toContain("/register");
    });


});