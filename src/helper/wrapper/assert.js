const { expect } = require("@playwright/test");

class Assert {
    static async assertTitle(page, title, logger) {
        logger && logger.info && logger.info(`Asserting page title is: ${title}`);
        try {
            await expect(page).toHaveTitle(title);
            logger && logger.success && logger.success(`Page title matches: ${title}`);
        } catch (e) {
            logger && logger.failure && logger.failure(`Page title assertion failed: ${title}`);
            throw e;
        }
    }

    static async assertTitleContains(page, title, logger) {
        logger && logger.info && logger.info(`Asserting page title contains: ${title}`);
        try {
            const pageTitle = await page.title();
            expect(pageTitle).toContain(title);
            logger && logger.success && logger.success(`Page title contains: ${title}`);
        } catch (e) {
            logger && logger.failure && logger.failure(`Page title does not contain: ${title}`);
            throw e;
        }
    }

    static async assertURL(page, url, logger) {
        logger && logger.info && logger.info(`Asserting page URL is: ${url}`);
        try {
            await expect(page).toHaveURL(url);
            logger && logger.success && logger.success(`Page URL matches: ${url}`);
        } catch (e) {
            logger && logger.failure && logger.failure(`Page URL assertion failed: ${url}`);
            throw e;
        }
    }

    static async assertURLContains(page, text, logger) {
        logger && logger.info && logger.info(`Asserting page URL contains: ${text}`);
        try {
            const pageURL = page.url();
            expect(pageURL).toContain(text);
            logger && logger.success && logger.success(`Page URL contains: ${text}`);
        } catch (e) {
            logger && logger.failure && logger.failure(`Page URL does not contain: ${text}`);
            throw e;
        }
    }

    static async assertElementExists(page, locator, logger) {
        logger && logger.info && logger.info(`Asserting element exists: ${locator}`);
        try {
            const element = page.locator(locator);
            await expect(element).toBeVisible();
            logger && logger.success && logger.success(`Element is visible: ${locator}`);
        } catch (e) {
            logger && logger.failure && logger.failure(`Element not visible: ${locator}`);
            throw e;
        }
    }

    static async assertElementNotExists(page, locator, logger) {
        logger && logger.info && logger.info(`Asserting element does not exist: ${locator}`);
        try {
            const element = page.locator(locator);
            await expect(element).not.toBeVisible();
            logger && logger.success && logger.success(`Element is not visible: ${locator}`);
        } catch (e) {
            logger && logger.failure && logger.failure(`Element is visible (should not be): ${locator}`);
            throw e;
        }
    }

    static async assertTrue(condition, logger) {
        logger && logger.info && logger.info("Asserting condition is true");
        try {
            expect(condition).toBeTruthy();
            logger && logger.success && logger.success("Condition is true");
        } catch (e) {
            logger && logger.failure && logger.failure("Condition is not true");
            throw e;
        }
    }

    static async assertTextContents(page, locator, expectedText, logger) {
        logger && logger.info && logger.info(`Asserting text contents for ${locator} is: ${expectedText}`);
        try {
            const element = page.locator(locator);
            await expect(element).toHaveText(expectedText);
            logger && logger.success && logger.success(`Text contents match for ${locator}`);
        } catch (e) {
            logger && logger.failure && logger.failure(`Text contents do not match for ${locator}`);
            throw e;
        }
    }
}

module.exports = Assert;
