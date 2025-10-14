import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../support/pageFixture";
import LoginPage from "../../pages/loginPage";
import * as configuration from "../../helper/Commonconfig/configuration.json";
import DashBoardPage from "../../pages/dashboardPage";

setDefaultTimeout(configuration.defaultTimeOut);

let loginPage: LoginPage;
let dashBoardPage : DashBoardPage;

Given('User should be landed to Dashboard page', async function () {
    loginPage = new LoginPage(fixture.page);
    await loginPage.navigateToDashboardPage();
    dashBoardPage = new DashBoardPage(fixture.page);
});

When('User clicks on the profile icon', async function (){
await dashBoardPage.clickOnProfileIcon();
});

Then('Clicks on the Logout button', async function (){
await dashBoardPage.clickOnLogoutButton();
});

Then('Click on Yes button on the logout popup', async function (){
await dashBoardPage.clickOnLogoutPopupYesButton();
});


Then('User should logout and navigated to Login Page',async  function(){
await dashBoardPage.navigateBackToLoginPage();
})