const { expect } = require("@playwright/test");
const PlaywrightWrapper = require("../helper/wrapper/PlaywrightWrappers");

class ContactPage {
    constructor(page, logger) {
        this.page = page;
        this.logger = logger;
        this.base = new PlaywrightWrapper(page, logger);
        this.Elements = {
            contactHeader: "//h1[contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'contact') or contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'support')]"
        };
    }

    async verifyContactPageLoaded() {
        try {
            if (this.logger) {
                this.logger.info("Verifying Contact page is loaded");
            }
            const header = this.page.locator(this.Elements.contactHeader);
            await expect(header).toBeVisible({ timeout: 15000 });
            if (this.logger) {
                this.logger.info("Contact page verification successful");
            }
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Contact page verification failed: ${error.message}`);
            }
            throw error;
        }
    }
}

module.exports = ContactPage;
