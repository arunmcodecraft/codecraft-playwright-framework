import { When, Then } from "@cucumber/cucumber";
import { fixture } from "../../support/pageFixture";
import ModuleRecordPage from "../../pages/aModuleRecordCreationPage";

let moduleRecordPage: ModuleRecordPage;

When('User searches and selects the module named {string}', async function (moduleName: string) {
        moduleRecordPage = new ModuleRecordPage(fixture.page);
        fixture.logger.info(`Searching for module: ${moduleName}`);
        await moduleRecordPage.searchAndSelectModule();
        fixture.logger.info('Module selected successfully');

});


Then('User navigates to the {string} screen', async function(screenName: string) {
        fixture.logger.info(`Verifying navigation to ${screenName} screen`);
        await moduleRecordPage.verifyModuleScreenOpened();
        fixture.logger.info(`Successfully navigated to ${screenName} screen`);
});

When('User clicks on "+Add" button to create a new form', async function () {
        moduleRecordPage = new ModuleRecordPage(fixture.page);
        fixture.logger.info('Clicking +Add button to create new form');
        await moduleRecordPage.clickAddButton();
        fixture.logger.info('+Add button clicked successfully');
    
});



When('User fills the complete form with test data', async function () {
        moduleRecordPage = new ModuleRecordPage(fixture.page);
        await moduleRecordPage.fillCompleteForm();
        fixture.logger.info('Successfully filled the complete form');
        
    
});

When('User clicks on "Begin and submit" button to submit the filled form', async function () {
    moduleRecordPage = new ModuleRecordPage(fixture.page);
    fixture.logger.info('Clicking Begin button to start form');
    await moduleRecordPage.clickBeginButton();
    fixture.logger.info('Begin button clicked successfully');
    fixture.logger.info('Clicking Submit button to submit form');
    await moduleRecordPage.clickSubmitButton();
    fixture.logger.info('Submit button clicked successfully');
    await moduleRecordPage.verifyModuleScreenOpened();
    fixture.logger.info('Navigates back to the "A mod" list screen');

});


When('User clicks on the {string} button and selects {string} from the ellipsis menu', async function (buttonText: string, menuOption: string){
        moduleRecordPage = new ModuleRecordPage(fixture.page);
        fixture.logger.info('Clicking Begin button to start form');
        await moduleRecordPage.clickBeginButton();
        fixture.logger.info('Begin button clicked successfully');
        fixture.logger.info('Clicking ellipsis menu');
        await moduleRecordPage.clickEllipsisMenu();
        fixture.logger.info('Ellipsis menu clicked successfully');
        fixture.logger.info('Clicking save and exit option')
        await moduleRecordPage.clickSaveAndExit();
        await moduleRecordPage.verifyModuleScreenOpened();
       fixture.logger.info('Navigates back to the "A mod" list screen');
    }
);

