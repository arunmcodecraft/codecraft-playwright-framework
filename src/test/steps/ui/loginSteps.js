const { Given, When, Then, setDefaultTimeout } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { fixture } = require("../../../support/pageFixture");
const configuration = require("../../../helper/commonConfig/configuration.json");

setDefaultTimeout(configuration.defaultTimeOut);

Given("User navigates to the application", async function () {
    console.log("process.env.BASEURL is " + process.env.BASEURL);
    const url = process.env.BASEURL;
    if (!url) {
        throw new Error("BASEURL is undefined. Check your .env file and dotenv.config()");
    }

    await fixture.subStepLogger.info(`Navigating to the application at URL: ${url}`);
    fixture.logger.info(`Navigating to the application at URL: ${url}`);
    await fixture.pages.loginPage.navigateToLoginPage();
    await fixture.subStepLogger.success("Application navigation complete.");
    fixture.logger.info("Application navigation complete.");
});

Given("User logs in with username {string} and password {string}", async function (username, password) {
    await fixture.subStepLogger.info(`Logging in with username: ${username}`);
    await fixture.pages.loginPage.loginUser(username, password);
    await fixture.subStepLogger.success("Login action performed.");
});

Given("User enters username", async function () {
    await fixture.subStepLogger.info(`Entering username: ${fixture.testData.userName}`);
    await fixture.pages.loginPage.enterUserName(fixture.testData.userName);
    await fixture.subStepLogger.success(`Entered username: ${fixture.testData.userName}`);
    fixture.logger.info(`Entered username: ${fixture.testData.userName}`);
});

Given("User enters password", async function () {
    await fixture.subStepLogger.info("Entering password.");
    await fixture.pages.loginPage.enterPassword(fixture.testData.password);
    await fixture.subStepLogger.success("Entered password.");
    fixture.logger.info(`Entered password: ${fixture.testData.password}`);
});

When("User clicks on the login button", async function () {
    await fixture.subStepLogger.info("Clicking the login button.");
    fixture.logger.info("Clicking the login button.");
    await fixture.pages.loginPage.clickLoginButton();
    await fixture.subStepLogger.success("Login button clicked.");
    fixture.logger.info("Login button clicked.");
});

Then("Logout from application", async function () {
    await fixture.subStepLogger.info("Logging out from application.");
    fixture.logger.info("Logging out from application.");
    await fixture.pages.loginPage.clickLogoutButton();
    await fixture.pages.loginPage.verifyBackToLogin();
    await fixture.subStepLogger.success("Logout completed successfully.");
    fixture.logger.info("Logout completed successfully.");
});

When("User Clicks on Useraname field", async function () {
    await fixture.subStepLogger.info("Clicking on the username field.");
    fixture.logger.info("Clicking on the username field.");
    await fixture.pages.loginPage.clickOnUserNameField();
    await fixture.subStepLogger.success("Username field clicked.");
    fixture.logger.info("Username field clicked.");
});

Then("User Clicks on password field", async function () {
    await fixture.subStepLogger.info("Clicking on the password field.");
    fixture.logger.info("Clicking on the password field.");
    await fixture.pages.loginPage.clickOnPasswordField();
    await fixture.subStepLogger.success("Password field clicked.");
    fixture.logger.info("Password field clicked.");
});

Then("Login should be successful", async function () {
    await fixture.subStepLogger.info("Verifying successful login.");
    fixture.logger.info("Verifying successful login.");
    const isLoggedIn = await fixture.pages.loginPage.verifySuccessfulLogin();
    await expect(isLoggedIn).toBe(true);
    await fixture.subStepLogger.success("Login verification completed successfully.");
    fixture.logger.info("Login verification completed successfully.");
});

