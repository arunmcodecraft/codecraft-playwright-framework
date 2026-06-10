const { Given, When, Then, setDefaultTimeout } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { fixture } = require("../../../support/pageFixture");
const configuration = require("../../../helper/commonConfig/configuration.json");

setDefaultTimeout(configuration.defaultTimeOut);

let loginPage;

Given("User navigates to the application", async function () {
    console.log("process.env.BASEURL is " + process.env.BASEURL);
    const url = process.env.BASEURL;
    if (!url) {
        throw new Error("BASEURL is undefined. Check your .env file and dotenv.config()");
    }
    fixture.logger.info(`Navigating to the application at URL: ${url}`);
    await fixture.page.goto(url);
    fixture.logger.info("Application navigation complete.");
    loginPage = new (require("../../../pages/loginPage"))(fixture.page);
});

When("User logs in with username {string} and password {string}", async function (username, password) {
    const LoginPage = require("../../../pages/loginPage");
    loginPage = new LoginPage(fixture.page, fixture.logger);
    fixture.logger.info(`Logging in with Username: ${username}`);
    fixture.logger.info(`Logging in with Password: ${password}`);
    await loginPage.loginUser(username, password);
    fixture.logger.info("Login action initiated with scenario-level credentials.");
});

Given("User enters username", async function () {
    await loginPage.enterUserName(fixture.testData.userName);
    fixture.logger.info(`Entered username: ${fixture.testData.userName}`);
});

Given("User enters password", async function () {
    await loginPage.enterPassword(fixture.testData.password);
    fixture.logger.info(`Entered password: ${fixture.testData.password}`);
});

When("User clicks on the login button", async function () {
    fixture.logger.info("Clicking the login button.");
    await loginPage.clickLoginButton();
    fixture.logger.info("Login button clicked.");
});

Then("Login should fail with error message {string}", async function (errorMessage) {
    fixture.logger.info(`Verifying login failure with error message: "${errorMessage}"`);
    const failureMessage = await loginPage.getEnterUsernameErrorMessage();
    fixture.logger.info(`Actual error message on page: ${await failureMessage.textContent()}`);
    await expect(failureMessage).toBeVisible();
    await expect(failureMessage).toHaveText(errorMessage);
    fixture.logger.info("Error message verified successfully.");
});

Then("User should be landed to Dashboard page", async function () {
    fixture.logger.info("Verifying that user is landed on the Dashboard page.");
    await fixture.pages.dashboardPage.verifyDashboardPageLoaded();
    fixture.logger.info("Dashboard page verification complete.");
});

When("User Clicks on Useraname field", async function () {
    fixture.logger.info("Clicking on the username field.");
    await loginPage.clickOnUserNameField();
    fixture.logger.info("Username field clicked.");
});

Then("User Clicks on password field", async function () {
    fixture.logger.info("Clicking on the password field.");
    await loginPage.clickOnPasswordField();
    fixture.logger.info("Password field clicked.");
});

Then("Check the {string} error message", async function (errorMessage) {
    fixture.logger.info(`Checking for error message: "${errorMessage}"`);
    const failureMessage = loginPage.getInvalidPasswordErrorMessage();
    fixture.logger.info(`Actual message found: ${await (await failureMessage).textContent()}`);
    await expect(failureMessage).toBeVisible();
    await expect(failureMessage).toHaveText(errorMessage);
    fixture.logger.info("Error message verified successfully.");
});

When("User enters userName {string} and password {string}", async function (userName, password) {
    console.log(">>>>>>", userName);
});

Then("Verify username {string} has list {list} is parsed successfuly", function (username, values) {
    console.log(username, "######", values.length);
});

Then("Verify {list} is parsed successfuly", function (values) {
    console.log("###@@@@@###", values);
});

