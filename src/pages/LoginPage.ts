import { Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * bstackdemo.com /signin uses react-select dropdowns for username & password.
 */
export class LoginPage extends BasePage {
  //private readonly usernameInput: Locator = this.page.locator('#react-select-2-input');
  private readonly usernameInput: Locator = this.page.locator("//a[text()='LOG IN ']");
  private readonly passwordInput: Locator = this.page.locator('#react-select-3-input');
  private readonly usernameDropDown: Locator = this.page.locator('#react-select-2-input');
  private readonly passwordDropDown: Locator = this.page.locator('#react-select-3-input');
  private readonly loginButton: Locator = this.page.locator('#login-btn');
  private readonly errorMessage: Locator = this.page.locator('[data-test="error"]');

  async navigate(): Promise<void> {
    await this.open('/GetaQuote');
    await this.page.waitForTimeout(6000);
    await expect(this.page).toHaveTitle("STATE FUND's EASY QUOTE");

    // 1. Ensure the page is fully loaded before screenshotting
    await this.page.waitForLoadState('domcontentloaded',{ timeout: 60000 });

    // const loginAnchor = this.page.locator("//button[@aria-label='Toggle navigation']").first();
    // await expect(loginAnchor).toBeVisible({ timeout: 10000 });
    // await loginAnchor.tap();
    await this.events.waitForVisible(this.usernameInput);

    //const txtuser = this.page.locator('#businessNameSuggest >> nth=0');
    const txtuser= await this.page.locator('#businessNameSuggest').first();
    //.fill('MUYXIPRGJB', { timeout: 30000 })
    await this.events.sendKeys(txtuser, "MUYXIPRGJB", {
      //   pressEnter: true,
      actionName: 'enterbusinessname',
    });

    const navToggler = this.page
      .locator("//a[text()='LOG IN ']")
      .first();

    await this.page.evaluate(() => document.readyState);


    await expect(navToggler).toBeVisible({ timeout: 10000 });
    //await navToggler.evaluate(btn => btn.click());
    await navToggler.evaluate((btn) => (btn as HTMLElement).click());
    await this.page.waitForLoadState('domcontentloaded');
  }



  async enterUsername(username: string): Promise<void> {
    // await this.events.click(this.usernameInput, 'click');
    // await this.events.selectFromDropdown(this.usernameInput, username, {
    //   actionName: 'enterUsername',
    // });
    // await this.events.sendKeys(this.usernameInput, username, {
    //   pressEnter: true,
    //   actionName: 'enterUsername',
    // });

    const txtuser = this.page.locator('#accountNameExistingUserComponent');
    await this.events.sendKeys(txtuser, username, {
      //   pressEnter: true,
      actionName: 'enterUsername',
    });
  }

  async enterPassword(password: string): Promise<void> {
    // await this.events.selectFromDropdown(this.passwordInput, password, {
    //   actionName: 'enterPassword',
    // });

    const passwordText = this.page.locator('#passwordExistingUserComponent');

    //await this.events.sendKeys(this.passwordInput, password, {
    await this.events.sendKeys(passwordText, password, {
      //pressEnter: true,
      actionName: 'enterPassword',
    });
  }

  async clickLogin(): Promise<void> {
    //await this.events.click(this.loginButton, 'clickLogin');
    const continueButton = this.page.locator('#btnCountinueWithApplication');
    await expect(continueButton).toBeVisible({ timeout: 10000 });
    await this.events.click(continueButton, 'clickLogin');

  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async getErrorMessage(): Promise<string> {
    await this.events.waitForVisible(this.errorMessage);
    return this.events.getText(this.errorMessage);
  }
}
