import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Page } from '@playwright/test';
import { BrowserManager } from '../browsers/BrowserManager';
import { Events } from '../events/Events';
import { ScreenshotManager } from '../screenshots/ScreenshotManager';
import { PageFactory } from '../factory/PageFactory';

export interface CustomWorldParams {
  [key: string]: unknown;
}

export class CustomWorld extends World {
  browserManager!: BrowserManager;
  page!: Page;
  events!: Events;
  screenshots!: ScreenshotManager;
  pageFactory!: PageFactory;

  constructor(options: IWorldOptions<CustomWorldParams>) {
    super(options);
  }

  initHelpers(page: Page): void {
    this.page = page;
    this.screenshots = new ScreenshotManager(page);
    this.events = new Events(page, this.screenshots);
    this.pageFactory = new PageFactory(page, this.events, this.screenshots);
  }
}

setWorldConstructor(CustomWorld);
