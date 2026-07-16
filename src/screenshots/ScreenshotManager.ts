import fs from 'fs';
import path from 'path';
import { Page } from '@playwright/test';

export class ScreenshotManager {
  private readonly outputDir: string;
  private counter = 0;

  constructor(
    private readonly page: Page,
    outputDir = path.resolve(process.cwd(), 'screenshots'),
  ) {
    this.outputDir = outputDir;
    fs.mkdirSync(this.outputDir, { recursive: true });
  }

  async takeAfterAction(actionName: string): Promise<string> {
    this.counter += 1;
    const safeName = actionName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${String(this.counter).padStart(3, '0')}_after_${safeName}.png`;
    const filePath = path.join(this.outputDir, fileName);

    await this.page.screenshot({ path: filePath, fullPage: false });
    return filePath;
  }

  async takeFullPage(name: string): Promise<string> {
    this.counter += 1;
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${String(this.counter).padStart(3, '0')}_${safeName}.png`;
    const filePath = path.join(this.outputDir, fileName);

    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  async attachToWorld(attach: (data: Buffer, mediaType: string) => Promise<void>): Promise<void> {
    const buffer = await this.page.screenshot({ fullPage: true });
    await attach(buffer, 'image/png');
  }

  getOutputDir(): string {
    return this.outputDir;
  }
}
