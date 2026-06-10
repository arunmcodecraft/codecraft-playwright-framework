const { expect } = require("@playwright/test");
const PlaywrightWrapper = require("../helper/wrapper/PlaywrightWrappers");

class LoginPage {
    constructor(page, logger) {
        this.page = page;
        this.logger = logger;
        this.base = new PlaywrightWrapper(page, logger);
        this.Elements = {
            usernameInput: '[id="username"]',
            passwordInput: '[type="password"]',
            loginBtn: "//button[@class='ig-button authentication-submit-button']",
            invalidPasswordErrorMessage: "//p[normalize-space()='Incorrect password!']",
            invalidUsernameErrorMessage: "//p[normalize-space()='Username does not exist!']"
        };
    }

    async navigateToLoginPage() {
        await this.base.goto("/login");
        await expect(this.page).toHaveTitle("iGoalZero");
    }

    async clickOnUserNameField() {
        await this.base.waitAndClick(this.Elements.usernameInput);
    }

    async clickOnPasswordField() {
        await this.base.waitAndClick(this.Elements.passwordInput);
    }

    async enterUserName(user) {
        await this.base.typeText(this.Elements.usernameInput, user);
    }

    async enterPassword(password) {
        await this.base.typeText(this.Elements.passwordInput, password);
    }

    async clickLoginButton() {
        await this.base.waitAndClick(this.Elements.loginBtn);
    }

    getInvalidPasswordErrorMessage() {
        return this.page.locator(this.Elements.invalidPasswordErrorMessage);
    }

    getEnterUsernameErrorMessage() {
        return this.page.locator(this.Elements.invalidUsernameErrorMessage);
    }

    async loginUser(user, password) {
        try {
            await this.enterUserName(user);
            await this.enterPassword(password);
            await this.clickLoginButton();
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Login failed: ${error.message}`);
            }
            throw error;
        }
    }

    async navigateToDashboardPage() {
        try {
            if (this.logger) {
                this.logger.info("Verifying navigation to Dashboard page");
                this.logger.info(`Current URL: ${this.page.url()}`);
                this.logger.info(`Current title: ${await this.page.title()}`);
            }
            await expect(this.page).toHaveTitle("iGoalZero");
            if (this.logger) {
                this.logger.info("Dashboard page verification successful");
            }
        } catch (error) {
            if (this.logger) {
                this.logger.error(`Dashboard verification failed: ${error.message}`);
            }
            throw error;
        }
    }
}

module.exports = LoginPage;
