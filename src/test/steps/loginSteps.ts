import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../support/pageFixture";
import LoginPage from "../../pages/loginPage";
import * as configuration from "../../helper/Commonconfig/configuration.json";

setDefaultTimeout(configuration.defaultTimeOut);

Given('User navigates to the application', async function () {
    console.log('process.env.BASEURL is ' + process.env.BASEURL);
    const url = process.env.BASEURL;
    if (!url) {
        throw new Error("❌ BASEURL is undefined. Check your .env file and dotenv.config()");
    }

    fixture.subStepLogger.info(`Navigating to the application at URL: ${url}`);
    fixture.logger.info(`Navigating to the application at URL: ${url}`);
    await fixture.pages.loginPage.navigateToLoginPage();
    fixture.subStepLogger.success("Application navigation complete.");
    fixture.logger.info("Application navigation complete.");
});

// ----------------- Login with scenario-level data -----------------
Given('User logs in with username {string} and password {string}', async function (username: string, password: string) {
    fixture.subStepLogger.info(`Logging in with username: ${username}`);
    await fixture.pages.loginPage.loginUser(username, password);
    fixture.subStepLogger.success('Login action performed.');
});

// ----------------- Optional: separate username/password steps -----------------
Given('User enters username', async function () {
    fixture.subStepLogger.info(`Entering username: ${fixture.testData.userName}`);
    await fixture.pages.loginPage.enterUserName(fixture.testData.userName);
    fixture.subStepLogger.success(`Entered username: ${fixture.testData.userName}`);
    fixture.logger.info(`Entered username: ${fixture.testData.userName}`);
});

Given('User enters password', async function () {
    fixture.subStepLogger.info(`Entering password.`);
    await fixture.pages.loginPage.enterPassword(fixture.testData.password);
    fixture.subStepLogger.success(`Entered password.`);
    fixture.logger.info(`Entered password: ${fixture.testData.password}`);
});

// ----------------- Login button -----------------
When('User clicks on the login button', async function () {
    fixture.subStepLogger.info('Clicking the login button.');
    fixture.logger.info('Clicking the login button.');
    await fixture.pages.loginPage.clickLoginButton();
    fixture.subStepLogger.success('Login button clicked.');
    fixture.logger.info('Login button clicked.');
});

// ----------------- Invalid Login -----------------
Then('Logout from application', async function () {
    fixture.subStepLogger.info('Logging out from application.');
    fixture.logger.info('Logging out from application.');
    await fixture.pages.loginPage.clickLogoutButton();
    await fixture.pages.loginPage.verifyBackToLogin();
    fixture.subStepLogger.success('Logout completed successfully.');
    fixture.logger.info('Logout completed successfully.');
});

// ----------------- Field interaction helpers -----------------
When('User Clicks on Useraname field', async function () {
    fixture.subStepLogger.info('Clicking on the username field.');
    fixture.logger.info('Clicking on the username field.');
    await fixture.pages.loginPage.clickOnUserNameField();
    fixture.subStepLogger.success('Username field clicked.');
    fixture.logger.info('Username field clicked.');
});

Then('User Clicks on password field', async function () {
    fixture.subStepLogger.info('Clicking on the password field.');
    fixture.logger.info('Clicking on the password field.');
    await fixture.pages.loginPage.clickOnPasswordField();
    fixture.subStepLogger.success('Password field clicked.');
    fixture.logger.info('Password field clicked.');
});

Then('Login should be successful', async function () {
    fixture.subStepLogger.info('Verifying successful login.');
    fixture.logger.info('Verifying successful login.');
    const isLoggedIn = await fixture.pages.loginPage.verifySuccessfulLogin();
    await expect(isLoggedIn).toBe(true);
    fixture.subStepLogger.success('Login verification completed successfully.');
    fixture.logger.info('Login verification completed successfully.');
});


When('User enters userName {string} and password {string}', async (userName: string, password: string) => {
    console.log(">>>>>>", userName)
});


Then('Verify username {string} has list {list} is parsed successfuly', (username: string, values: string[]) => {
    console.log(username, "######", values.length)
})

Then('Verify {list} is parsed successfuly', (values: string[]) => {
    console.log("###@@@@@###", values)
})
