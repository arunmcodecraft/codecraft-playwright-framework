import { Page, Locator } from "@playwright/test";

export default class PlaywrightWrapper {
    constructor(private page: Page) { }

    // ✅ Reusable waitFor method
    async waitForElement(locator: string): Promise<Locator> {
        const element = this.page.locator(locator);
        await element.waitFor({ state: "visible" });
        return element;
    }

    async goto(url: string) {
        await this.page.goto(url, { waitUntil: "domcontentloaded" });
    }

    async waitAndClick(locator: string) {
        const element = await this.waitForElement(locator);
        await element.click();
    }

    async navigateTo(link: string) {
        await Promise.all([
            this.page.waitForNavigation(),
            this.page.click(link)
        ]);
    }

    async typeText(locator: string, text: string) {
        const element = await this.waitForElement(locator);
        await element.fill(text);
    }

    async selectOption(locator: string, value: string) {
        const element = await this.waitForElement(locator);
        await element.selectOption({ label: value });
    }

    async check(locator: string) {
        const element = await this.waitForElement(locator);
        await element.check();
    }

    async uncheck(locator: string) {
        const element = await this.waitForElement(locator);
        await element.uncheck();
    }

    async getText(locator: string): Promise<string | null> {
        const element = await this.waitForElement(locator);
        return await element.textContent();
    }

    async elementExists(locator: string): Promise<boolean> {
        const element = this.page.locator(locator);
        return (await element.count()) > 0;
    }
}
