const { expect } = require("@playwright/test");
const PlaywrightWrapper = require("../helper/wrapper/PlaywrightWrappers");

class DashBoardPage {
    constructor(page, logger) {
        this.page = page;
        this.logger = logger;
        this.base = new PlaywrightWrapper(page, logger);
        this.Elements = {
            profileIcon: "//span[contains(@class,'userBadge')]",
            logoutButton: "//a[normalize-space()='Logout']"
        };
    }

    async clickOnProfileIcon() {
        try {
            await this.base.waitAndClick(this.Elements.profileIcon);
            if (this.logger) {
                this.logger.info("Profile icon clicked successfully");
            }
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Failed to click profile icon: ${error.message}`);
            }
            throw error;
        }
    }

    async clickLogoutButton() {
        try {
            await this.base.waitAndClick(this.Elements.logoutButton);
            if (this.logger) {
                this.logger.info("Logout button clicked successfully");
            }
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Failed to click logout button: ${error.message}`);
            }
            throw error;
        }
    }

    async navigateBackToLoginPage() {
        try {
            await this.base.waitForURL("/login");
            if (this.logger) {
                this.logger.info("Successfully navigated back to Login page");
            }
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Failed to navigate to login page: ${error.message}`);
            }
            throw error;
        }
    }

    async verifyDashboardPageLoaded() {
        try {
            await this.base.waitForElement(this.Elements.profileIcon);
            await expect(this.page.locator(this.Elements.profileIcon)).toBeVisible();
            if (this.logger) {
                this.logger.info("Dashboard page is loaded and profile icon is visible.");
            }
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Dashboard page verification failed: ${error.message}`);
            }
            throw error;
        }
    }
}

module.exports = DashBoardPage;
