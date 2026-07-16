import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly title: Locator = this.page.locator('.title');
  private readonly inventoryList: Locator = this.page.locator('.shelf-container');
  //private readonly menuButton: Locator = this.page.locator('#react-burger-menu-btn');
  private readonly logoutLink: Locator = this.page.locator('#signin');
  private readonly buyButton: Locator = this.page.locator('.buy-btn');

  private readonly filterButton: Locator = this.page.locator('.filters > div:nth-child(1)');


  async getTitle(): Promise<string> {
    await this.events.waitForVisible(this.title);
    return this.events.getText(this.title);
  }

  async isDisplayed(): Promise<boolean> {
    // Waits until a list has exactly 5 items loaded into the DOM
    // await this.page.waitForFunction(() => document.querySelectorAll('.shelf-container').length === 5);
    await this.page.waitForFunction(
      () => document.querySelectorAll('.shelf-container').length === 1,
    );
    return this.events.isVisible(this.inventoryList);
  }

  async logout(): Promise<void> {
    // await this.events.click(this.menuButton, 'openMenu');
    //await this.events.click(this.filterButton, 'filter');
    await this.page.locator('.shelf-item__buy-btn').nth(0).click();
    await this.events.click(this.buyButton, 'buyButton');
    await expect(this.logoutLink).toBeVisible();
    await this.events.click(this.logoutLink, 'logoutLink');
  }
}
