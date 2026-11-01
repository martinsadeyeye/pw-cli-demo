// spec: specs/saucedemo-login.md (scenario 1.4)
// seed: tests/seed.spec.ts (not yet created; navigation is done via loginPage.goto())
import { test, expect } from "../../src/fixtures/base";
import { meta } from "reporting-labs";
import users from "../data/users.json";

test.describe("Login", () => {
  test("empty password shows required error @smoke @critical", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    meta({
      priority: "P2",
      severity: "normal",
      feature: "authentication",
      component: "login",
      scenario: "1.4",
    });

    const { username } = users.standard;

    await loginPage.goto();

    // 1. Type 'standard_user' into the Username field
    await loginPage.usernameInput.fill(username);
    await expect(loginPage.usernameInput).toHaveValue(username);

    // 2. Leave the Password field empty
    await expect(loginPage.passwordInput).toBeEmpty();

    // 3. Click the Login button
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      "Epic sadface: Password is required"
    );
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(loginPage.usernameInput).toHaveValue(username);
    await expect(inventoryPage.title).toHaveCount(0);
  });
});
