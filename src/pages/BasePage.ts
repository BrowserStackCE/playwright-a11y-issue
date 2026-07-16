import { Page } from '@playwright/test';
import { Events } from '../events/Events';
import { ScreenshotManager } from '../screenshots/ScreenshotManager';
import { env } from '../support/env';

export abstract class BasePage {
  constructor(
    protected readonly page: Page,
    protected readonly events: Events,
    protected readonly screenshots: ScreenshotManager,
  ) {}

  async open(path = ''): Promise<void> {
    const url = path.startsWith('http') ? path : `${env.baseUrl}${path}`;
    await this.events.navigate(url, `open_${this.constructor.name}`);
  }

  getPage(): Page {
    return this.page;
  }
}
