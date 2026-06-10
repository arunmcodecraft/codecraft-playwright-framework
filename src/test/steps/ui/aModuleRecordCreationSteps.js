const { When, Then, setDefaultTimeout } = require("@cucumber/cucumber");
const { fixture } = require("../../../support/pageFixture");
const configuration = require("../../../helper/commonConfig/configuration.json");

setDefaultTimeout(configuration.defaultTimeOut);

let moduleRecordPage;

When("User searches and selects the module named {string}", async function (moduleName) {
    const ModuleRecordPage = require("../../../pages/aModuleRecordCreationPage");
    moduleRecordPage = new ModuleRecordPage(fixture.page, fixture.logger);
    fixture.logger.info(`Searching for module: ${moduleName}`);
    await moduleRecordPage.searchAndSelectModule();
    fixture.logger.info("Module selected successfully");
});

Then("User navigates to the {string} screen", async function (screenName) {
    fixture.logger.info(`Verifying navigation to ${screenName} screen`);
    await moduleRecordPage.verifyModuleScreenOpened();
    fixture.logger.info(`Successfully navigated to ${screenName} screen`);
});

When("User clicks on \"+Add\" button to create a new form", async function () {
    const ModuleRecordPage = require("../../../pages/aModuleRecordCreationPage");
    moduleRecordPage = new ModuleRecordPage(fixture.page, fixture.logger);
    fixture.logger.info("Clicking +Add button to create new form");
    await moduleRecordPage.clickAddButton();
    fixture.logger.info("+Add button clicked successfully");
});

When("User fills the complete form with test data", async function () {
    const ModuleRecordPage = require("../../../pages/aModuleRecordCreationPage");
    moduleRecordPage = new ModuleRecordPage(fixture.page, fixture.logger);
    await moduleRecordPage.fillCompleteForm();
    fixture.logger.info("Successfully filled the complete form");
});

When("User clicks on \"Begin and submit\" button to submit the filled form", async function () {
    const ModuleRecordPage = require("../../../pages/aModuleRecordCreationPage");
    moduleRecordPage = new ModuleRecordPage(fixture.page, fixture.logger);
    fixture.logger.info("Clicking Begin button to start form");
    await moduleRecordPage.clickBeginButton();
    fixture.logger.info("Begin button clicked successfully");
    fixture.logger.info("Clicking Submit button to submit form");
    await moduleRecordPage.clickSubmitButton();
    fixture.logger.info("Submit button clicked successfully");
    await moduleRecordPage.verifyModuleScreenOpened();
    fixture.logger.info('Navigates back to the "A mod" list screen');
});

When("User clicks on the {string} button and selects {string} from the ellipsis menu", async function (buttonText, menuOption) {
    const ModuleRecordPage = require("../../../pages/aModuleRecordCreationPage");
    moduleRecordPage = new ModuleRecordPage(fixture.page, fixture.logger);
    fixture.logger.info("Clicking Begin button to start form");
    await moduleRecordPage.clickBeginButton();
    fixture.logger.info("Begin button clicked successfully");
    fixture.logger.info("Clicking ellipsis menu");
    await moduleRecordPage.clickEllipsisMenu();
    fixture.logger.info("Ellipsis menu clicked successfully");
    fixture.logger.info("Clicking save and exit option");
    await moduleRecordPage.clickSaveAndExit();
    await moduleRecordPage.verifyModuleScreenOpened();
    fixture.logger.info('Navigates back to the "A mod" list screen');
});

Then("User opens the first created form from the list and verifies all field values are present", async function () {
    const ModuleRecordPage = require("../../../pages/aModuleRecordCreationPage");
    moduleRecordPage = new ModuleRecordPage(fixture.page, fixture.logger);
    fixture.logger.info("Opening the first created form from the list");
    await moduleRecordPage.openFirstFormFromList();
    fixture.logger.info("Verifying all field values in the opened form");
    await moduleRecordPage.verifyFormFieldValues();
    fixture.logger.info("Form field values verified successfully");
});
