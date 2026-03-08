const { expect } = require("@playwright/test");
const PlaywrightWrapper = require("../helper/wrapper/PlaywrightWrappers");

class LoginPage {
    constructor(page, logger) {
        this.page = page;
        this.logger = logger;
        this.base = new PlaywrightWrapper(page, logger);
        this.Elements = {
            usernameInput: "#username",
            passwordInput: "#password",
            loginBtn: "#submit",
            logoutBtn: "//a[text()='Log out']",
            successMessage: "//h1[contains(normalize-space(),'Logged In Successfully')]",
            loginPageTitle: "Test Login | Practice Test Automation"
        };
    }
// navigate to Login Page
    async navigateToLoginPage() {
        await this.base.goto("practice-test-login/");
        await expect(this.page).toHaveTitle(this.Elements.loginPageTitle);
    }

    async clickOnUserNameField() {
        await this.base.waitAndClick(this.Elements.usernameInput);
    }

    async clickOnPasswordField() {
        await this.base.waitAndClick(this.Elements.passwordInput);
    }

    async enterUserName(user) {
        await this.base.typeText(this.Elements.usernameInput, user, "Username");
    }

    async enterPassword(password) {
        await this.base.typePassword(this.Elements.passwordInput, password, "Password");
    }

    async clickLoginButton() {
        await this.base.waitAndClick(this.Elements.loginBtn, "Login");
    }

    async clickLogoutButton() {
        await this.base.waitAndClick(this.Elements.logoutBtn, "Logout");
    }

    async verifySuccessfulLogin() {
        await this.base.waitForURL(/logged-in-successfully/);
        await this.base.waitForElement(this.Elements.logoutBtn);
        return this.page.locator(this.Elements.successMessage).isVisible();
    }

    async verifyBackToLogin() {
        await expect(this.page).toHaveTitle(this.Elements.loginPageTitle);
    }

    async loginUser(user, password) {
        await this.enterUserName(user);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    async navigateToDashboardPage() {
        await this.base.goto("logged-in-successfully/");
        await this.base.waitForElement(this.Elements.successMessage);
    }
}

module.exports = LoginPage;
