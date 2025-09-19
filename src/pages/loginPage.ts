import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";


export default class LoginPage {
    private base: PlaywrightWrapper
    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }

    private Elements = {
        usernameInput: '[id="mat-input-0"]',
        passwordInput: '[id="mat-input-1"]',
        loginBtn: "//button[text()=' Log In ']",
        invalidCredentialserrorMessage: "//span[text()='Invalid credentials']",
        enterEmailErrorMessage: "//mat-error[text()=' Please enter the email ']",
    }

    async navigateToLoginPage() {
        await this.base.goto("/login");
        await expect(this.page).toHaveTitle("Asset Management");
    }

    async clickOnUserNameField()
    {
        await this.page.locator(this.Elements.usernameInput).click();
    }

    async clickOnPasswordField()
    {
        await this.page.locator(this.Elements.passwordInput).click();
    }

    async enterUserName(user: string) {
        await this.page.locator(this.Elements.usernameInput).fill(user);
    }
    async enterPassword(Password: string) {
        await this.page.locator(this.Elements.passwordInput).fill(Password);
    }

    async clickLoginButton() {
        await this.base.waitAndClick(this.Elements.loginBtn);
    }

    //Getting the error message for invalid credentials
     getInvalidCredentialsErrorMessage() {
        this.page.waitForTimeout(3000);
        return this.page.locator(this.Elements.invalidCredentialserrorMessage);
    }

    //Getting the error message for enter valid Email Error message yolo 
    getEnterEmailErrorMessage(){
       this.page.waitForTimeout(3000);
        return this.page.locator(this.Elements.enterEmailErrorMessage);

    }

    async loginUser(user: string, password: string) {
        await this.enterUserName(user);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }


}
