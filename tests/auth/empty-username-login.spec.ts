// spec: specs/saucedemo-login.md (scenario 1.3)
// seed: tests/seed.spec.ts (not yet created; navigation is done via loginPage.goto())
import { test, expect } from "../../src/fixtures/base";
import { meta } from "reporting-labs";

test.describe("Login", () => {
  test("empty username shows required error @smoke @critical", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    meta({
      priority: "P2",
      severity: "normal",
      feature: "authentication",
      component: "login",
      scenario: "1.3",
    });

    await loginPage.goto();

    // 1. Leave both the Username and Password fields empty
    await expect(loginPage.usernameInput).toBeEmpty();
    await expect(loginPage.passwordInput).toBeEmpty();

    // 2. Click the Login button
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      "Epic sadface: Username is required"
    );
    await expect(page).toHaveURL("https://www.saucedemo.com/");
    await expect(
      loginPage.errorMessage.getByRole("button", { name: "Dismiss error" })
    ).toBeVisible();
    await expect(inventoryPage.title).toHaveCount(0);
  });
});
