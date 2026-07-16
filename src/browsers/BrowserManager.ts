import {
  Browser,
  BrowserContext,
  chromium,
  firefox,
  webkit,
  Page,
  devices,
} from '@playwright/test';
import { env, BrowserName } from '../support/env';

/**
 * Manages browser lifecycle for local browsers and BrowserStack SDK runs.
 *
 * When tests are launched via `browserstack-node-sdk`, Playwright's
 * chromium.launch() is intercepted and routed to BrowserStack platforms
 * defined in browserstack.yml — no manual CDP connect is required.
 */
export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;
  private readonly browserName: BrowserName;

  constructor(browserName: BrowserName = env.browser) {
    this.browserName = browserName;
  }

  async launch(): Promise<Page> {
    if (env.useBrowserStackSdk || this.browserName === 'browserstack') {
      // SDK intercepts chromium.launch() and maps to platforms in browserstack.yml
      //this.browser = await chromium.launch({ headless: true });
      this.browser = await this.launchBrowserStackSDK();

    } else {
      this.browser = await this.launchLocalBrowser();
    }

    this.context = await this.browser.newContext({
      viewport: devices['Desktop Chrome'].viewport,
      ignoreHTTPSErrors: true,
    });
    this.page = await this.context.newPage();
    return this.page;
  }

  private async launchLocalBrowser(): Promise<Browser> {
    switch (this.browserName) {
      case 'chrome':
        return chromium.launch({
          ...(process.env.BROWSER_CHANNEL === 'chrome' ? { channel: 'chrome' as const } : {}),
          headless: env.headless,
        });
      case 'firefox':
        return firefox.launch({ headless: env.headless });
      case 'edge':
        return chromium.launch({
          channel: 'msedge',
          headless: env.headless,
        });
      case 'webkit':
        return webkit.launch({ headless: env.headless });
      default:
        throw new Error(
          `Unsupported browser: ${this.browserName}. Use chrome, firefox, edge, webkit, or browserstack.`,
        );
    }
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error('Browser has not been launched. Call launch() first.');
    }
    return this.page;
  }

  getContext(): BrowserContext {
    if (!this.context) {
      throw new Error('Browser context is not available.');
    }
    return this.context;
  }

  getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser is not available.');
    }
    return this.browser;
  }

  getBrowserName(): BrowserName {
    return this.browserName;
  }

  async close(): Promise<void> {
    await this.page?.close().catch(() => undefined);
    await this.context?.close().catch(() => undefined);
    await this.browser?.close().catch(() => undefined);
    this.page = null;
    this.context = null;
    this.browser = null;
  }

  async launchBrowserStackSDK(): Promise<Browser> {

    console.log("launch browserstack SDK");
    try {
      // Read browserstack.yml via YamlUtils
      // SDK handles the actual configuration — we just need these for logging/reporting
      // const yaml = new YamlUtils();
      // const bsYmlPath = 'browserstack.yml';
      // const buildName = String(yaml.getYamlValue(bsYmlPath, 'buildName', 'UTAF2.0 Build'));
      // const projectName = String(yaml.getYamlValue(bsYmlPath, 'projectName', 'UTAF2.0'));
      // const bsOS = String(yaml.getYamlValue(bsYmlPath, 'platforms[0].os', ''));

      // SDK sets these env vars automatically; fallback to yml values
      const bsUsername =
        process.env.BROWSERSTACK_USERNAME;
      const bsAccessKey =
        process.env.BROWSERSTACK_ACCESS_KEY;

      const bsOSName = 'Windows';

      const bsOSVersion = '11';

      const bsBrowserName = 'chrome';
      const bsBrowserVersion = '148.0';
      const bsType = 'Desktop';
      const bsTimezone = '';
      const bsGeoLocation = '';
      const bsDeviceName = '';

      if (!bsUsername || !bsAccessKey) {
        throw new Error('BrowserStack credentials not found in browserstack.yml or environment');
      }

      const bsCapabilities: any = {
        'browser': bsBrowserName.toLowerCase(),
        'browserVersion': bsBrowserVersion,
        'os': bsOSName,
        'osVersion': bsOSVersion,
        'name': "SCIf Session name",
        'build': "SCIF build",
        'project': "Scif Issue",
        'browserstack.username': bsUsername,
        'browserstack.accessKey': bsAccessKey
      };


      // Local testing configuration (only if using tunnel)
      const bsLocal = 'true';

      if (bsLocal) {
        bsCapabilities['browserstack.local'] = true;
        bsCapabilities['browserstack.localIdentifier'] = "SCIF build";
      }

      // Optional: Timezone and geolocation for Playwright
      if (bsTimezone) {
        bsCapabilities['browserstack.timezone'] = bsTimezone;
      }
      if (bsGeoLocation) {
        bsCapabilities['browserstack.geoLocation'] = bsGeoLocation;
      }

      // Encode capabilities as base64 for CDP URL
      const capsJson = JSON.stringify(bsCapabilities);
      const capsBase64 = Buffer.from(capsJson).toString('base64');
      console.log(`BrowserStack Capabilities: ${capsJson}`);
      console.log(`BrowserStack Capabilities (Base64): ${capsBase64}`);


      // SDK wrapper intercepts chromium.launch() and routes to BrowserStack
      return await chromium.launch({
        headless: false,
        args: [
          '--disable-blink-features=AutomationControlled',
          '--disable-dev-shm-usage',
          '--no-sandbox'
        ]
      });

      // Connect to BrowserStack CDP - No proxy needed for WebSocket
      // if (bsBrowserName.toLowerCase() === 'chrome' || bsBrowserName.toLowerCase() === 'edge') {
      //   // NEW CODE: Use CDP for Chrome and Edge (Chromium-based)
      //   const cdpUrl = `wss://${bsUsername}:${bsAccessKey}@cdp.browserstack.com/playwright?caps=${encodeURIComponent(capsJson)}`;
      //   return await chromium.connect(cdpUrl);
      // } else if (bsBrowserName.toLowerCase() === 'firefox') {
      //   // NEW CODE: Use Playwright's remote connection for Firefox
      //   const wsUrl = `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(capsJson)}`;
      //   return await firefox.connect(wsUrl);
      // } else {
      //   throw new Error(`BrowserStack: Unsupported browser for remote connection: ${bsBrowserName}`);
      // }
    } catch (error) {

      throw error;
    }
  }

}

