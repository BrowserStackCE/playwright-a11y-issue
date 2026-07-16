import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export type BrowserName = 'chrome' | 'firefox' | 'edge' | 'webkit' | 'browserstack';

/** True when running under `browserstack-node-sdk` (set by npm scripts). */
const useBrowserStackSdk =
  process.env.USE_BROWSERSTACK_SDK === 'true' ||
  process.env.BROWSERSTACK_SDK === 'true';

export const env = {
  browser: (process.env.BROWSER || 'chrome').toLowerCase() as BrowserName,
  headless: process.env.HEADLESS !== 'false',
  baseUrl: process.env.BASE_URL || 'https://t2.statefunddirect.com',
  useBrowserStackSdk,
  browserstack: {
    username: process.env.BROWSERSTACK_USERNAME || '',
    accessKey: process.env.BROWSERSTACK_ACCESS_KEY || '',
  },
};
