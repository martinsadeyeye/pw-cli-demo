import { defineConfig } from "@playwright/test";
import reportingLabs from "./reporting-labs.config";

export default defineConfig({
  testDir: "./tests",
  reporter: [
    ["list"],
    ["reporting-labs", reportingLabs],
    ["allure-playwright", { resultsDir: "allure-results" }],
  ],
  use: {
    // SauceDemo uses `data-test` rather than Playwright's default `data-testid`.
    testIdAttribute: "data-test",
  },
});
