import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";
import { HTMLSubStepLogger } from "../support/htmllSubStepLogger";

export default class LoginPage {
    private base: PlaywrightWrapper;

    constructor(private page: Page, private logger: HTMLSubStepLogger) {
        this.base = new PlaywrightWrapper(page, logger);
    }

    private Elements = {
        usernameInput: '#username',
        passwordInput: '#password',
        loginBtn: '#submit',
        logoutBtn: "//a[text()='Log out']",
        successMessage: "//h1[text()='Logged In Successfully']",
        loginPageTitle: "Test Login | Practice Test Automation"
    }

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

    async enterUserName(user: string) {
        await this.base.typeText(this.Elements.usernameInput, user, 'Username');
    }

    async enterPassword(password: string) {
        await this.base.typePassword(this.Elements.passwordInput, password, 'Password');
    }

    async clickLoginButton() {
        await this.base.waitAndClick(this.Elements.loginBtn, 'Login');
    }

    async clickLogoutButton() {
        await this.base.waitAndClick(this.Elements.logoutBtn, 'Logout');
    }

    async verifySuccessfulLogin() {
        await this.base.waitForElement(this.Elements.successMessage);
        return await this.page.locator(this.Elements.successMessage).isVisible();
    }

    async verifyBackToLogin() {
        await expect(this.page).toHaveTitle(this.Elements.loginPageTitle);
    }

    async loginUser(user: string, password: string) {
        await this.enterUserName(user);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }


    async navigateToDashboardPage() {
        await this.base.goto("logged-in-successfully/");
        await this.base.waitForElement(this.Elements.successMessage);
    }
}
