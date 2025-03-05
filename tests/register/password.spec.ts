import {test, expect} from '@playwright/test';
const password = "CgmoDreda@1";
const email = "cgDmoSjredx@gmail.com";
const codeforcesHandle = "Elglaly";
const phoneNumber = "+201228386402";
const username ="Sherif1214"
import {
    invalidPassword,
    passwordRequired,
    passwordMustMatch,
    passwordExceedsMaxLength,
    passwordContainsUsername,
    passwordContainsEmail,
    successMessage

} from "@/lib/const/error-messages";

test.describe("Register Page Testing For Password", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/register");
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.fill('input[name="gmail"]', email);
        await page.fill('input[name="phoneNumber"]', phoneNumber);
        await page.locator('input[type="checkbox"]').check();
    });

    test("Test Case 17 – Weak Password – Too Short", async ({ page }) => {
        const weakPassword = "Co@1";
        await page.fill('input[name="password"]', weakPassword);
        await page.fill('input[name="confirmPassword"]', weakPassword);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${invalidPassword}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 18 – Password Missing Uppercase", async ({ page }) => {
        const passwordMissingUppercase = "cgmored@1";
        await page.fill('input[name="password"]', passwordMissingUppercase);
        await page.fill('input[name="confirmPassword"]', passwordMissingUppercase);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${invalidPassword}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 19 – Password Missing Lowercase", async ({ page }) => {
        const password = "CGMOREDA@1";
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${invalidPassword}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 20 – Password Missing Digits", async ({ page }) => {
        const password = "Cgmoreda@";
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${invalidPassword}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 21 – Password Missing Special Characters", async ({ page }) => {
        const password = "Cgmoreda1";
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${invalidPassword}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 22 – Password Contains Username", async ({ page }) => {
        const password = "Sherif12";
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordContainsUsername}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 23 – Password Contains Email", async ({ page }) => {
        const password = "cgmoredax@gmail.com";
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordContainsEmail}`);
        expect(errorMessageElement).not.toBeNull();
    });

    //TODO:
    // test("Test Case 24 – Common Password", async ({ page }) => {
    //     const password = "Password123";
    //     await page.fill('input[name="password"]', password);
    //     await page.fill('input[name="confirmPassword"]', password);
    //     awgit statuait page.click('button[type="submit"]');
    //     const errorMessageElement = await page.waitForSelector(`text=${errorMessageForPassword}`);
    //     expect(errorMessageElement).not.toBeNull();
    // });

    test("Test Case 25 – Password Mismatch", async ({ page }) => {
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password+"ee");
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordMustMatch}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 26 – Password Empty", async ({ page }) => {
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordRequired}`);
        expect(errorMessageElement).not.toBeNull();
    });
    test("Test Case 27 – Password too long", async ({ page }) => {
        await page.fill('input[name="password"]', "Cgmoreda@1".padEnd(110,"a"));
        await page.fill('input[name="confirmPassword"]', "Cgmoreda@1".padEnd(110,"a"));
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordExceedsMaxLength}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 28 – Valid Password", async ({ page }) => {
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
        await page.click('button[type="submit"]');

        // Log the API response
        const [response] = await Promise.all([
            page.waitForResponse(response => response.url().includes("/api/auth/register")),
        ]);
        console.log("Response Status:", response.status());
        console.log("Response Body:", await response.json());

        // Wait for the success message to appear
        const errorMessageElement = await page.waitForSelector(`text=${successMessage}`);
        expect(errorMessageElement).not.toBeNull();
    });

});

