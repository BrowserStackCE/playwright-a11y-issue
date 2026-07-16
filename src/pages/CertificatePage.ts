import { expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CertificatePage extends BasePage {
    private portalLink: Locator = this.page.locator('#portalLink');

    async finalStep(): Promise<void> {

        //const portalLink = page.locator('#portalLink');
        try {
            await this.portalLink.waitFor({ state: 'attached', timeout: 5000 }).catch(() => { });
            if (await this.portalLink.isVisible()) {
                await this.portalLink.evaluate(btn => (btn as HTMLElement).click());
            }
        } catch (error) {
            console.log(error);
        }

    }


}
