const { Given, When, Then, setDefaultTimeout } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { fixture } = require("../../support/pageFixture");
const configuration = require("../../helper/Commonconfig/configuration.json");

setDefaultTimeout(configuration.defaultTimeOut);

Given("User navigates to Contact page", async function () {
    await fixture.subStepLogger.info("Navigating to Contact page");
    fixture.logger.info("Navigating to Contact page");
    await fixture.pages.contactPage.navigateToContactPage();
    await fixture.subStepLogger.success("Contact page navigation complete.");
    fixture.logger.info("Contact page navigation complete.");
});

When("User fills contact form with first name {string}, last name {string}, email {string} and message {string}", async function (firstName, lastName, email, message) {
    await fixture.subStepLogger.info(`Filling contact form with: ${firstName} ${lastName}, ${email}`);
    fixture.logger.info(`Filling contact form with: ${firstName} ${lastName}, ${email}`);
    await fixture.pages.contactPage.fillContactForm(firstName, lastName, email, message);
    await fixture.subStepLogger.success("Contact form filled successfully.");
    fixture.logger.info("Contact form filled successfully.");
});

Then("Contact form should be filled successfully", async function () {
    await fixture.subStepLogger.info("Verifying contact form is filled");
    fixture.logger.info("Verifying contact form is filled");
    const isFilled = await fixture.pages.contactPage.verifyFormFilled();
    await expect(isFilled).toBe(true);
    await fixture.subStepLogger.success("Contact form fill verified successfully.");
    fixture.logger.info("Contact form fill verified successfully.");
});
