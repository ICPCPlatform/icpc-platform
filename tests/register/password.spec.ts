import {test, expect} from '@playwright/test';
const password = "Cgmoreda@1";
const email = "cgmoredax@gmail.com";
const codeforcesHandle = "Elglaly";
const phoneNumber = "+201026386402";
const username ="Sherif12"
const successMessage = "Registration successful. Please check your email for verification.";
import {
    invalidPassword,
    passwordRequired,
    passwordMismatch,
    passwordExceedsMaxLength,
    passwordContainsUsername,
    passwordContainsEmail

} from "@/lib/const/error-messages";

test.describe("Register Page Testing For Password", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:3000/register");
        await page.fill('input[name="username"]', username);
        await page.fill('input[name="cfHandle"]', codeforcesHandle);
        await page.fill('input[name="gmail"]', email);
        await page.fill('input[name="phoneNumber"]', phoneNumber);
    });

    test("Test Case 17 – Weak Password – Too Short", async ({ page }) => {
        const weakPassword = "Cgmo@1";
        await page.fill('input[name="password"]', weakPassword);
        await page.fill('input[name="confirmPassword"]', weakPassword);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${invalidPassword}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 18 – Password Missing Uppercase", async ({ page }) => {
        const password = "cgmoreda@1";
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
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
        const password = "Sherif12@1";
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordContainsUsername}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 23 – Password Contains Email", async ({ page }) => {
        const password = "cgmoredax@gmail.com@1";
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
    //     await page.click('button[type="submit"]');
    //     const errorMessageElement = await page.waitForSelector(`text=${errorMessageForPassword}`);
    //     expect(errorMessageElement).not.toBeNull();
    // });

    test("Test Case 25 – Password Mismatch", async ({ page }) => {
        await page.fill('input[name="password"]', "Cgmoreda@1");
        await page.fill('input[name="confirmPassword"]', "Cgmoreda@2");
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordMismatch}`);
        expect(errorMessageElement).not.toBeNull();
    });
    test("Test Case 25 – Password Empty", async ({ page }) => {
        await page.fill('input[name="password"]', "");
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordRequired}`);
        expect(errorMessageElement).not.toBeNull();
    });
    test("Test Case 25 – Password too long", async ({ page }) => {
        await page.fill('input[name="password"]', "Cgmoreda@1".padEnd(100,"a"));
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${passwordExceedsMaxLength}`);
        expect(errorMessageElement).not.toBeNull();
    });

    test("Test Case 17 – Valid Password", async ({ page }) => {
        await page.fill('input[name="password"]', password);
        await page.fill('input[name="confirmPassword"]', password);
        await page.click('button[type="submit"]');
        const errorMessageElement = await page.waitForSelector(`text=${successMessage}`);
        expect(errorMessageElement).not.toBeNull();
    });

});

