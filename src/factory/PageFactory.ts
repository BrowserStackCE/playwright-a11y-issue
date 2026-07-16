import { Page } from '@playwright/test';
import { Events } from '../events/Events';
import { ScreenshotManager } from '../screenshots/ScreenshotManager';
import { BasePage } from '../pages/BasePage';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import {CertificatePage} from '../pages/CertificatePage';


type PageConstructor<T extends BasePage> = new (
  page: Page,
  events: Events,
  screenshots: ScreenshotManager,
) => T;

/**
 * Factory for creating and caching Page Object instances.
 */
export class PageFactory {
  private readonly cache = new Map<string, BasePage>();

  constructor(
    private readonly page: Page,
    private readonly events: Events,
    private readonly screenshots: ScreenshotManager,
  ) {}

  getPage<T extends BasePage>(PageClass: PageConstructor<T>): T {
    const key = PageClass.name;
    const cached = this.cache.get(key);
    if (cached) {
      return cached as T;
    }

    const instance = new PageClass(this.page, this.events, this.screenshots);
    this.cache.set(key, instance);
    return instance;
  }

  getLoginPage(): LoginPage {
    return this.getPage(LoginPage);
  }

  getInventoryPage(): InventoryPage {
    return this.getPage(InventoryPage);
  }

  getCertificatePage(): CertificatePage {
    return this.getPage(CertificatePage);
  }

  clearCache(): void {
    this.cache.clear();
  }
}
