import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class LoginPage {
    private base: PlaywrightWrapper;

    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        usernameInput: '[id="username"]',
        passwordInput: '[type="password"]',
        loginBtn: "//button[@class='ig-button authentication-submit-button']",
        invalidPasswordErrorMessage: "//p[normalize-space()='Incorrect password!']",
        invalidUsernameErrorMessage: "//p[normalize-space()='Username does not exist!']"
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
    getInvalidPasswordErrorMessage() {
        return this.page.locator(this.Elements.invalidPasswordErrorMessage);
    }

    // Get locator for missing email error message
    getEnterUsernameErrorMessage() {
        return this.page.locator(this.Elements.invalidUsernameErrorMessage);
    }

    async loginUser(user: string, password: string) {
        await this.enterUserName(user);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    
    async navigateToDashboardPage() {
        await expect(this.page).toHaveTitle("iGoalZero");
    }
}
