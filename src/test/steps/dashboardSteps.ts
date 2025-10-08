import { Given, When, Then, setDefaultTimeout } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";
import LoginPage from "../../pages/loginPage";
import * as configuration from "../../helper/Commonconfig/configuration.json";

setDefaultTimeout(configuration.defaultTimeOut);

let loginPage: LoginPage;

Given('User should be landed to Dashboard page', async function () {
    loginPage = new LoginPage(fixture.page);
    await loginPage.navigateToDashboardPage();
});