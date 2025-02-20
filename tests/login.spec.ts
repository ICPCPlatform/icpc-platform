import { test, expect } from '@playwright/test';

test.describe("Login Test Suite", () => {
  const usernameOrEmail = "reda";
  const password = "Cgmoreda@123";

  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
  });

  // Positive Test: Successful Login
  test("should redirect to /profile on successful login (status 200)", async ({ page }) => {
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL("/profile");
    expect(page.url()).toContain("/profile");
  });

  // Negative Test: Login with Email Field Empty
  test("should display error when username field is empty", async ({ page }) => {
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Email is required");
  });

  // Negative Test: Login with Password Field Empty
  test("should display error when password field is empty", async ({ page }) => {
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Password is required");
  });

  // Negative Test: Login with Invalid Email Format
  test("should display error for invalid username format", async ({ page }) => {
    await page.fill('input[name="username"]', "invalid-username");
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Invalid Email format");
  });

  // Negative Test: Login with Incorrect Password
  test("should display error for incorrect password", async ({ page }) => {
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Incorrect password");
  });

  // Security Test: Login with SQL Injection in Email Field
  test("should prevent SQL injection in username field", async ({ page }) => {
    await page.fill('input[name="username"]', "cgmoredax@gmail.com' OR '1'='1");
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Invalid credentials");
  });

  // Security Test: Login with SQL Injection in Password Field
  test("should prevent SQL injection in password field", async ({ page }) => {
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.fill('input[name="password"]', "Cgmoreda@123' OR '1'='1");
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Invalid credentials");
  });

  // Security Test: Login with XSS Attempt in Email Field
  test("should prevent XSS in username field", async ({ page }) => {
    await page.fill('input[name="username"]', '<script>alert("XSS")</script>');
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Invalid Email format");
  });

  // Security Test: Login with XSS Attempt in Password Field
  test("should prevent XSS in password field", async ({ page }) => {
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.fill('input[name="password"]', '<script>alert("XSS")</script>');
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Invalid credentials");
  });

  // Edge Case: Login with Password Exceeding Maximum Length
  test("should display error for password exceeding maximum length", async ({ page }) => {
    const longPassword = "a".repeat(257); // Assuming max length is 256
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.fill('input[name="password"]', longPassword);
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Password must be less than 256 characters");
  });

  // Edge Case: Login with Email Exceeding Maximum Length
  test("should display error for username exceeding maximum length", async ({ page }) => {
    const longEmail = "a".repeat(257) + "@gmail.com"; // Assuming max length is 256
    await page.fill('input[name="username"]', longEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Email must be less than 256 characters");
  });

  // Edge Case: Login with Password Containing Spaces at Start and End
  test("should trim spaces in password field", async ({ page }) => {
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.fill('input[name="password"]', "  Cgmoreda@123  ");
    await page.click('button[type="submit"]');
    await page.waitForURL("/profile");
    expect(page.url()).toContain("/profile");
  });

  // Edge Case: Login with 'Remember Me' Option Selected
  test("should remember user after login with 'Remember Me' selected", async ({ page }) => {
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.fill('input[name="password"]', password);
    await page.check('input[name="rememberMe"]');
    await page.click('button[type="submit"]');
    await page.waitForURL("/profile");

    // Verify that the user is remembered (e.g., check cookies or local storage)
    const rememberMeCookie = await page.context().cookies();
    expect(rememberMeCookie.some(cookie => cookie.name === "rememberMe")).toBeTruthy();
  });

  // Security Test: Login Attempt After Five Failed Logins
  test("should lock account after five failed login attempts", async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.fill('input[name="username"]', usernameOrEmail);
      await page.fill('input[name="password"]', "wrongpassword");
      await page.click('button[type="submit"]');
      await expect(page.locator(".error-message")).toContainText("Incorrect password");
    }

    // Sixth attempt should lock the account
    await page.fill('input[name="username"]', usernameOrEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await expect(page.locator(".error-message")).toContainText("Account locked");
  });
});