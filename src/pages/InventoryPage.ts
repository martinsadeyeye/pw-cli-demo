import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {
  readonly title: Locator;
  readonly sortDropdown: Locator;
  readonly cartButton: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId("title");
    this.sortDropdown = page.getByRole("combobox", { name: "Sort products" });
    this.cartButton = page.getByRole("button", { name: "Cart, empty" });
    this.inventoryItems = page.getByTestId("inventory-item");
  }

  async goto(): Promise<void> {
    await this.page.goto("https://www.saucedemo.com/inventory.html");
  }
}
