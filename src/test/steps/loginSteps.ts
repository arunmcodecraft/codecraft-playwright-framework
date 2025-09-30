import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import LoginPage from "../../pages/loginPage";
import { ExcelUtils } from "../../helper/readFromExcel/excelUtils";
import * as paths from "../../helper/config/paths.json";

setDefaultTimeout(60 * 1000 * 2);

let loginPage: LoginPage; // declare variable

Given('User navigates to the application', async function () {
    await fixture.page.goto(process.env.BASEURL);
    fixture.logger.info("Navigated to the application");
    loginPage = new LoginPage(fixture.page); // initialize here
}); 

Given('User log in with data {string}', async function (dataKey: string) {
    loginPage = new LoginPage(fixture.page);
    const sheetName = process.env.ENV || 'staging';
    const allData = await ExcelUtils.readData(paths.testDataLocation, sheetName);
   // Find the user data by the key passed from the feature file
const loginData = allData.find(row => row.Key === dataKey);
if (loginData) {
    await loginPage.loginUser(loginData.userName, loginData.password);
} else {
    throw new Error(`Data for key '${dataKey}' not found.`);
}
});


Given('User enter the username as {string}', async function (username) {
    await loginPage.enterUserName(username);
});

Given('User enter the password as {string}', async function (password) {
    await loginPage.enterPassword(password);
});

When('User click on the login button', async function () {
    await loginPage.clickLoginButton();
});

Then('Login should be success', async function () {
    const user = fixture.page.locator("//button[contains(@class,'mat-focus-indicator mat-menu-trigger')]//span[1]");
    await expect(user).toBeVisible();
    const userName = await user.textContent();
    console.log("Username: " + userName);
    fixture.logger.info("Username: " + userName);
});


Then('Login should fail with error message {string}', async function (errorMessage) {
    const failureMesssage = await loginPage.getInvalidCredentialsErrorMessage();
   // console.log("Message is"+ (await loginPage.getInvalidCredentialsErrorMessage()).textContent());
    await expect(failureMesssage).toBeVisible();
    await expect(failureMesssage).toHaveText(errorMessage);
});


When('User Click on Useraname field', async function () {
   await loginPage.clickOnUserNameField();
});

Then('User Click on password field', async function () {
   await loginPage.clickOnPasswordField();
});

Then('Check the {string} error message', async function (errorMessage) {
    const failureMesssage = loginPage.getEnterEmailErrorMessage();
    console.log("Message is"+ (await loginPage.getEnterEmailErrorMessage()).textContent());
    await expect(failureMesssage).toBeVisible();
    await expect(failureMesssage).toHaveText(errorMessage);
});

