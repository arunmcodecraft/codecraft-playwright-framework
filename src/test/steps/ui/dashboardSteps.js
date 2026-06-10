const { Given, When, Then, setDefaultTimeout } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { fixture } = require("../../../support/pageFixture");
const configuration = require("../../../helper/commonConfig/configuration.json");

setDefaultTimeout(configuration.defaultTimeOut);

let loginPage;
let dashBoardPage;

Then("User should be landed to Dashboard page", async function () {
    const LoginPage = require("../../../pages/loginPage");
    loginPage = new LoginPage(fixture.page, fixture.logger);
    await loginPage.navigateToDashboardPage();
    const DashBoardPage = require("../../../pages/dashboardPage");
    dashBoardPage = new DashBoardPage(fixture.page, fixture.logger);
});

When("User clicks on the profile icon", async function () {
    fixture.logger.info("Clicking on profile icon");
    await dashBoardPage.clickOnProfileIcon();
});

Then("Clicks on the Logout button", async function () {
    fixture.logger.info("Clicking on Logout button");
    await dashBoardPage.clickLogoutButton();
});

Then("User should logout and navigated to Login Page", async function () {
    fixture.logger.info("Verifying navigation back to Login Page");
    await dashBoardPage.navigateBackToLoginPage();
});
