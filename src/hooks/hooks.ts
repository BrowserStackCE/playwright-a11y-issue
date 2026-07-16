import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  BeforeStep,
  AfterStep,
  Status,
  setDefaultTimeout,
  ITestCaseHookParameter,
  ITestStepHookParameter,
} from '@cucumber/cucumber';
import fs from 'fs';
import path from 'path';
import { CustomWorld } from '../support/world';
import { BrowserManager } from '../browsers/BrowserManager';
import { Events } from '../events/Events';
import { ScreenshotManager } from '../screenshots/ScreenshotManager';
import { PageFactory } from '../factory/PageFactory';
import { env } from '../support/env';

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  for (const dir of ['screenshots', 'reports']) {
    fs.mkdirSync(path.resolve(process.cwd(), dir), { recursive: true });
  }
  const mode = env.useBrowserStackSdk ? 'BrowserStack SDK' : env.browser;
  console.log(`\nRunning tests on: ${mode} (headless=${env.headless})\n`);
});

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  this.browserManager = new BrowserManager(env.browser);
  const page = await this.browserManager.launch();

  const scenarioName = scenario.pickle.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const screenshotDir = path.resolve(process.cwd(), 'screenshots', scenarioName);

  this.page = page;
  this.screenshots = new ScreenshotManager(page, screenshotDir);
  this.events = new Events(page, this.screenshots);
  this.pageFactory = new PageFactory(page, this.events, this.screenshots);
});

BeforeStep(async function (this: CustomWorld, step: ITestStepHookParameter) {
  const stepText = step.pickleStep?.text ?? 'unknown_step';
  console.log(`  → ${stepText}`);
});

AfterStep(async function (this: CustomWorld, step: ITestStepHookParameter) {
  // After-action screenshots are taken by Events via ScreenshotManager.
  // On step failure, capture an extra diagnostic screenshot.
  if (step.result?.status === Status.FAILED && this.screenshots) {
    const stepText = step.pickleStep?.text ?? 'failed_step';
    const safeName = stepText.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
    await this.screenshots.takeAfterAction(`failed_${safeName}`);
  }
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  if (scenario.result?.status === Status.FAILED && this.screenshots) {
    const failurePath = await this.screenshots.takeFullPage('scenario_failed');
    const buffer = fs.readFileSync(failurePath);
    await this.attach(buffer, 'image/png');
  }

  await this.browserManager?.close();
});

AfterAll(async function () {
  console.log('\nAll scenarios completed.\n');
});
