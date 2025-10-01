import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import LoginPage from "../../pages/loginPage";
import { ExcelUtils } from "../../helper/readFromExcel/excelUtils";
import * as paths from "../../helper/config/paths.json";

setDefaultTimeout(60 * 1000 * 2);

let loginPage: LoginPage;

Given('User navigates to the application', async function () {
    fixture.logger.info(`Navigating to the application at URL: ${process.env.BASEURL}`);
    await fixture.page.goto(process.env.BASEURL);
    fixture.logger.info("Application navigation complete.");
    loginPage = new LoginPage(fixture.page);
}); 

Given('User log in with data {string}', async function (dataKey: string) {
    fixture.logger.info(`Attempting to log in with data key: ${dataKey}`);
    loginPage = new LoginPage(fixture.page);
    const sheetName = process.env.ENV || 'staging';
    fixture.logger.info(`Reading data from sheet: ${sheetName}`);
    const allData = await ExcelUtils.readData(paths.testDataLocation, sheetName);
    const loginData = allData.find(row => row.Key === dataKey);

    if (loginData) {
        fixture.logger.info(`Data found: Username - ${loginData.userName}, Password - ${loginData.password}`);
        await loginPage.loginUser(loginData.userName, loginData.password);
        fixture.logger.info('Login action initiated with provided credentials.');
    } else {
        fixture.logger.error(`Data for key '${dataKey}' not found in Excel sheet.`);
        throw new Error(`Data for key '${dataKey}' not found.`);
    }
});

Given('User enter the username as {string}', async function (username) {
    fixture.logger.info(`Entering username: ${username}`);
    await loginPage.enterUserName(username);
    fixture.logger.info('Username entered successfully.');
});

Given('User enter the password as {string}', async function (password) {
    fixture.logger.info(`Entering password: ${password}`);
    await loginPage.enterPassword(password);
    fixture.logger.info('Password entered successfully.');
});

When('User click on the login button', async function () {
    fixture.logger.info('Clicking the login button.');
    await loginPage.clickLoginButton();
    fixture.logger.info('Login button clicked.');
});

Then('Login should be success', async function () {
    const user = fixture.page.locator("//button[contains(@class,'mat-focus-indicator mat-menu-trigger')]//span[1]");
    fixture.logger.info('Verifying user is visible on the page.');
    await expect(user).toBeVisible();
    const userName = await user.textContent();
    fixture.logger.info(`Login successful. User name displayed: ${userName}`);
});

Then('Login should fail with error message {string}', async function (errorMessage) {
    fixture.logger.info(`Verifying login failure with error message: "${errorMessage}"`);
    const failureMesssage = await loginPage.getInvalidCredentialsErrorMessage();
    fixture.logger.info(`Actual error message found on page: ${await failureMesssage.textContent()}`);
    await expect(failureMesssage).toBeVisible();
    await expect(failureMesssage).toHaveText(errorMessage);
    fixture.logger.info('Error message verified successfully.');
});

When('User Click on Useraname field', async function () {
    fixture.logger.info('Clicking on the username field.');
    await loginPage.clickOnUserNameField();
    fixture.logger.info('Username field clicked.');
});

Then('User Click on password field', async function () {
    fixture.logger.info('Clicking on the password field.');
    await loginPage.clickOnPasswordField();
    fixture.logger.info('Password field clicked.');
});

Then('Check the {string} error message', async function (errorMessage) {
    fixture.logger.info(`Checking for error message: "${errorMessage}"`);
    const failureMesssage = loginPage.getEnterEmailErrorMessage();
    fixture.logger.info(`Actual message found: ${await (await loginPage.getEnterEmailErrorMessage()).textContent()}`);
    await expect(failureMesssage).toBeVisible();
    await expect(failureMesssage).toHaveText(errorMessage);
    fixture.logger.info('Error message verified successfully.');
});