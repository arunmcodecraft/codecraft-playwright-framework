import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../support/pageFixture";
import LoginPage from "../../pages/loginPage";
import * as configuration from "../../helper/Commonconfig/configuration.json";

setDefaultTimeout(configuration.defaultTimeOut);

let loginPage: LoginPage;

Given('User navigates to the application', async function () {
    console.log('process.env.BASEURL is ' + process.env.BASEURL);
    const url = process.env.BASEURL;
    if (!url) {
        throw new Error("❌ BASEURL is undefined. Check your .env file and dotenv.config()");
    }

    fixture.logger.info(`Navigating to the application at URL: ${url}`);
    await fixture.page.goto(url);  // fixture.page must already be initialized in Before hook
    fixture.logger.info("Application navigation complete.");

    loginPage = new LoginPage(fixture.page);
});

// ----------------- Login with scenario-level data -----------------
Given('User logs in with username {string} and password {string}', async function (username: string, password: string) {
    loginPage = new LoginPage(fixture.page);
    fixture.logger.info(`Logging in with Username: ${username}`);
    fixture.logger.info(`Logging in with Password: ${password}`);
    await loginPage.loginUser(username, password);
    fixture.logger.info("Login action initiated with scenario-level credentials.");
});

// ----------------- Optional: separate username/password steps -----------------
Given('User enters username', async function () {
    await loginPage.enterUserName(fixture.testData.userName);
    fixture.logger.info(`Entered username: ${fixture.testData.userName}`);
});

Given('User enters password', async function () {
    await loginPage.enterPassword(fixture.testData.password);
    fixture.logger.info(`Entered password: ${fixture.testData.password}`);
});

// ----------------- Login button -----------------
When('User clicks on the login button', async function () {
    fixture.logger.info('Clicking the login button.');
    await loginPage.clickLoginButton();
    fixture.logger.info('Login button clicked.');
});

// ----------------- Invalid Login -----------------
Then('Login should fail with error message {string}', async function (errorMessage) {
    fixture.logger.info(`Verifying login failure with error message: "${errorMessage}"`);
    const failureMessage = await loginPage.getInvalidCredentialsErrorMessage();
    fixture.logger.info(`Actual error message on page: ${await failureMessage.textContent()}`);
    await expect(failureMessage).toBeVisible();
    await expect(failureMessage).toHaveText(errorMessage);
    fixture.logger.info('Error message verified successfully.');
});

// ----------------- Field interaction helpers -----------------
When('User Clicks on Useraname field', async function () {
    fixture.logger.info('Clicking on the username field.');
    await loginPage.clickOnUserNameField();
    fixture.logger.info('Username field clicked.');
});

Then('User Clicks on password field', async function () {
    fixture.logger.info('Clicking on the password field.');
    await loginPage.clickOnPasswordField();
    fixture.logger.info('Password field clicked.');
});

Then('Check the {string} error message', async function (errorMessage) {
    fixture.logger.info(`Checking for error message: "${errorMessage}"`);
    const failureMessage = loginPage.getEnterEmailErrorMessage();
    fixture.logger.info(`Actual message found: ${await (await failureMessage).textContent()}`);
    await expect(failureMessage).toBeVisible();
    await expect(failureMessage).toHaveText(errorMessage);
    fixture.logger.info('Error message verified successfully.');
});


When('User enters userName {string} and password {string}', async (userName: string, password: string) => {
    console.log(">>>>>>", userName)
});


Then('Verify username {string} has list {list} is parsed successfuly', (username:string,values: string[]) => {
  console.log(username,"######",values.length)
})

Then('Verify {list} is parsed successfuly', (values: string[]) => {
    console.log("###@@@@@###", values)
})
