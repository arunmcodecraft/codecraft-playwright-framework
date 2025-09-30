import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class LoginPage {
    private base: PlaywrightWrapper;

    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        usernameInput: '[id="mat-input-0"]',
        passwordInput: '[id="mat-input-1"]',
        loginBtn: "//button[text()=' Log In ']",
        invalidCredentialsErrorMessage: "//span[text()='Invalid credentials']",
        enterEmailErrorMessage: "//mat-error[text()=' Please enter the email ']"
    }

    async navigateToLoginPage() {
        await this.base.goto("/login");
        await expect(this.page).toHaveTitle("Asset Management");
    }

    async clickOnUserNameField() {
        await this.base.waitAndClick(this.Elements.usernameInput);
    }

    async clickOnPasswordField() {
        await this.base.waitAndClick(this.Elements.passwordInput);
    }

    async enterUserName(user: string) {
        await this.base.typeText(this.Elements.usernameInput, user);
    }

    async enterPassword(password: string) {
        await this.base.typeText(this.Elements.passwordInput, password);
    }

    async clickLoginButton() {
        await this.base.waitAndClick(this.Elements.loginBtn);
    }

    // Get locator for invalid credentials error message
    async getInvalidCredentialsErrorMessage() {
        await this.base.waitForElement(this.Elements.invalidCredentialsErrorMessage);
        return this.page.locator(this.Elements.invalidCredentialsErrorMessage);
    }

    // Get locator for missing email error message
    getEnterEmailErrorMessage() {
        return this.page.locator(this.Elements.enterEmailErrorMessage);
    }

    async loginUser(user: string, password: string) {
        await this.enterUserName(user);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }
}
