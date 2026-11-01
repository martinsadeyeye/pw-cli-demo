// spec: specs/saucedemo-login.md (scenario 1.2)
// seed: tests/seed.spec.ts (not yet created; navigation is done via loginPage.goto())
import { test, expect } from "../../src/fixtures/base";
import { meta } from "reporting-labs";
import users from "../data/users.json";

test.describe("Login", () => {
  test("locked out user sees error @smoke @critical", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    meta({
      priority: "P1",
      severity: "critical",
      feature: "authentication",
      component: "login",
      scenario: "1.2",
    });

    const { username, password } = users.locked;

    await loginPage.goto();

    // 1. Type 'locked_out_user' into the Username field
    await loginPage.usernameInput.fill(username);

    // 2. Type 'secret_sauce' into the Password field
    await loginPage.passwordInput.fill(password);

    // 3. Click the Login button
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      "Epic sadface: Sorry, this user has been locked out."
    );
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(loginPage.usernameInput).toHaveValue(username);
    await expect(loginPage.passwordInput).toHaveValue(password);
    await expect(loginPage.loginButton).toBeVisible();
    await expect(inventoryPage.title).toHaveCount(0);
  });
});
