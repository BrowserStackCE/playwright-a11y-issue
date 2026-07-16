import { Locator, Page } from '@playwright/test';
import { ScreenshotManager } from '../screenshots/ScreenshotManager';

/**
 * Centralises UI interactions (click, type, select, etc.)
 * and captures an after-action screenshot for each event.
 */
export class Events {
  constructor(
    private readonly page: Page,
    private readonly screenshots: ScreenshotManager,
  ) {}

  async click(locator: Locator, actionName = 'click'): Promise<void> {
    await locator.click();
    await this.screenshots.takeAfterAction(actionName);
  }

  async doubleClick(locator: Locator, actionName = 'doubleClick'): Promise<void> {
    await locator.dblclick();
    await this.screenshots.takeAfterAction(actionName);
  }

  async sendKeys(
    locator: Locator,
    text: string,
    options: { clear?: boolean; pressEnter?: boolean; actionName?: string } = {},
  ): Promise<void> {
    const { clear = true, pressEnter = false, actionName = 'sendKeys' } = options;
    if (clear) {
      await locator.fill('');
    }
    await locator.fill(text);
    if (pressEnter) {
      await locator.press('Enter');
    }
    await this.screenshots.takeAfterAction(actionName);
  }

  async type(
    locator: Locator,
    text: string,
    options: { delay?: number; actionName?: string } = {},
  ): Promise<void> {
    const { delay = 50, actionName = 'type' } = options;
    await locator.pressSequentially(text, { delay });
    await this.screenshots.takeAfterAction(actionName);
  }

  async clear(locator: Locator, actionName = 'clear'): Promise<void> {
    await locator.fill('');
    await this.screenshots.takeAfterAction(actionName);
  }

  async selectOption(
    locator: Locator,
    value: string | string[],
    actionName = 'selectOption',
  ): Promise<void> {
    await locator.selectOption(value);
    await this.screenshots.takeAfterAction(actionName);
  }

  /**
   * Opens a custom dropdown (e.g. react-select) and selects an option by visible text.
   */
  async selectFromDropdown(
    dropdown: Locator,
    optionText: string,
    options: { actionName?: string; optionLocator?: Locator } = {},
  ): Promise<void> {
    const { actionName = 'selectFromDropdown', optionLocator } = options;

    // react-select opens reliably via the indicator SVG
    const indicator = dropdown.locator('svg').first();
    if (await indicator.count()) {
      await indicator.click();
    } else {
      await dropdown.click();
    }

    const option =
      optionLocator ??
      this.page.locator('div[id*="-option-"]').filter({ hasText: new RegExp(`^${escapeRegExp(optionText)}$`) });

    await option.first().waitFor({ state: 'visible', timeout: 10000 });
    await option.first().click();
    await this.screenshots.takeAfterAction(actionName);
  }

  async check(locator: Locator, actionName = 'check'): Promise<void> {
    await locator.check();
    await this.screenshots.takeAfterAction(actionName);
  }

  async uncheck(locator: Locator, actionName = 'uncheck'): Promise<void> {
    await locator.uncheck();
    await this.screenshots.takeAfterAction(actionName);
  }

  async hover(locator: Locator, actionName = 'hover'): Promise<void> {
    await locator.hover();
    await this.screenshots.takeAfterAction(actionName);
  }

  async pressKey(key: string, actionName = 'pressKey'): Promise<void> {
    await this.page.keyboard.press(key);
    await this.screenshots.takeAfterAction(actionName);
  }

  async navigate(url: string, actionName = 'navigate'): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await this.screenshots.takeAfterAction(actionName);
  }

  async waitForVisible(locator: Locator, timeout = 10000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
