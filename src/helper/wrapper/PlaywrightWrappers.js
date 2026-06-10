const { expect } = require("@playwright/test");

class PlaywrightWrapper {
    constructor(page, logger) {
        this.page = page;
        this.logger = logger;
    }

    async waitForElement(locator) {
        const element = this.page.locator(locator);
        await element.waitFor({ state: "visible" });
        return element;
    }

    async goto(path) {
        const baseUrl = process.env.BASEURL;
        if (!baseUrl) {
            throw new Error("BASEURL is undefined. Check your .env file and dotenv.config()");
        }

        const url = new URL(path, baseUrl).toString();
        const response = await this.page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        if (!response || !response.ok()) {
            throw new Error(`Navigation failed: ${response ? response.status() : "NA"} ${response ? response.statusText() : "NA"} for URL: ${url}`);
        }
    }

    async waitAndClick(locator, objName = "") {
        const element = await this.waitForElement(locator);
        await element.click();
        await this.logger.info(`Clicked on element: ${objName || locator}`);
    }

    async navigateTo(link) {
        await Promise.all([this.page.waitForNavigation(), this.page.click(link)]);
    }

    async waitForURL(expectedURL, timeout = 5000) {
        if (typeof expectedURL === "string") {
            const escaped = expectedURL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            await expect(this.page).toHaveURL(new RegExp(escaped), { timeout });
        } else {
            await expect(this.page).toHaveURL(expectedURL, { timeout });
        }
    }

    async waitForURLAfterAction(action, expectedURL, timeout = 5000) {
        await Promise.all([
            action(),
            this.page.waitForURL(expectedURL, { timeout })
        ]);
    }

    async typeText(locator, text, objName = "") {
        const element = await this.waitForElement(locator);
        await element.fill(text);
        await this.logger.info(`Typed ${text} into element: ${objName || locator}`);
    }

    async typePassword(locator, text, objName = "") {
        const element = await this.waitForElement(locator);
        await element.fill(text);
        await this.logger.info(`Typed ******** into element: ${objName || locator}`);
    }

    async selectOption(locator, value, objName = "") {
        const element = await this.waitForElement(locator);
        await element.selectOption({ label: value });
        await this.logger.info(`Selected option ${value} in element: ${objName || locator}`);
    }

    async check(locator, objName = "") {
        const element = await this.waitForElement(locator);
        await element.check();
        await this.logger.info(`Checked element: ${objName || locator}`);
    }

    async uncheck(locator, objName = "") {
        const element = await this.waitForElement(locator);
        await element.uncheck();
        await this.logger.info(`Unchecked element: ${objName || locator}`);
    }

    async getText(locator) {
        const element = await this.waitForElement(locator);
        return element.textContent();
    }

    async elementExists(locator) {
        const element = this.page.locator(locator);
        return (await element.count()) > 0;
    }

    async elementVisible(locator) {
        const element = this.page.locator(locator);
        return element.isVisible();
    }

    static async parseStringArray(values) {
        return new Promise((resolve) => {
            const result = values
                .replace(/^\[|\]$/g, "")
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);
            resolve(result);
        });
    }

    async uploadFile(locator, filePath, objName = "") {
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.locator(locator).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
        await this.logger.info(`Uploaded file: ${objName || filePath}`);
    }
}

module.exports = PlaywrightWrapper;
