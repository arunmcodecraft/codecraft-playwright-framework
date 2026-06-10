const { When, Then } = require("@cucumber/cucumber");
const { fixture } = require("../../../support/pageFixture");
const AModuleFilterPage = require("../../../pages/aModuleFilterPage");

let aModuleFilterPage;

When('User clicks on the filter button next to Summary', async function () {
    aModuleFilterPage = new AModuleFilterPage(fixture.page, fixture.logger);
    fixture.logger.info('Clicking filter button');
    await aModuleFilterPage.clickFilterButton();
    fixture.logger.info('Filter button clicked successfully');
});

When('User expands the {string} filter section', async function (filterName) {
    fixture.logger.info(`Expanding ${filterName} filter section`);
    await aModuleFilterPage.expandFilterSection(filterName);
    fixture.logger.info(`${filterName} filter section expanded`);
});

When('User selects {string} from the {string} filter options', async function (option, filterName) {
    fixture.logger.info(`Selecting ${option} from ${filterName} filter`);
    await aModuleFilterPage.selectFilterOption(option);
    fixture.logger.info(`${option} selected from ${filterName} filter`);
});

When('User selects custom date range from {string} to {string}', async function (fromDate, toDate) {
    fixture.logger.info(`Selecting custom date range from ${fromDate} to ${toDate}`);
    await aModuleFilterPage.selectCustomDateRange(fromDate, toDate);
    fixture.logger.info(`Custom date range ${fromDate} to ${toDate} selected`);
});

When('User deselects {string} from the {string} filter options', async function (option, filterName) {
    fixture.logger.info(`Deselecting ${option} from ${filterName} filter`);
    await aModuleFilterPage.deselectFilterOption(option);
    fixture.logger.info(`${option} deselected from ${filterName} filter`);
});

Then('active filter {word} should display {string}', async function (filterName, option) {
    fixture.logger.info(`Verifying active filter ${filterName} displays ${option}`);
    await aModuleFilterPage.verifyActiveFilterBadge(filterName, option);
    fixture.logger.info(`Active filter ${filterName} displays ${option}`);
});

Then('all status filter options should be checked', async function () {
    fixture.logger.info('Verifying all status filter options are checked');
    await aModuleFilterPage.verifyStatusCheckboxState(['Select All', 'Closed', 'Draft', 'In Progress'], true);
    fixture.logger.info('All status filter options are checked');
});

Then('all status filter options should be unchecked', async function () {
    fixture.logger.info('Verifying all status filter options are unchecked');
    await aModuleFilterPage.verifyStatusCheckboxState(['Select All', 'Closed', 'Draft', 'In Progress'], false);
    fixture.logger.info('All status filter options are unchecked');
});

When('User clicks on the {string} button', async function (buttonName) {
    fixture.logger.info(`Clicking ${buttonName} button`);
    if (buttonName === 'Apply') {
        await aModuleFilterPage.clickApplyButton();
    } else if (buttonName === 'Reset') {
        await aModuleFilterPage.clickResetButton();
    } else if (buttonName === 'Clear All') {
        await aModuleFilterPage.clickClearAllButton();
    }
    fixture.logger.info(`${buttonName} button clicked successfully`);
});

Then('active filters should be cleared', async function () {
    fixture.logger.info('Verifying active filters are cleared');
    await aModuleFilterPage.verifyActiveFiltersCleared();
    fixture.logger.info('Active filters are cleared');
});

Then('User should see only records with {string} status in the A Mod screen', async function (expectedStatus) {
    fixture.logger.info(`Verifying all records have status: ${expectedStatus}`);
    await aModuleFilterPage.verifyAllRecordsHaveStatus(expectedStatus);
    fixture.logger.info(`Verified all records have status: ${expectedStatus}`);
});

Then('User should see all records in the A Mod screen', async function () {
    fixture.logger.info('Verifying all records are visible after reset');
    await aModuleFilterPage.verifyAllRecordsAreVisible();
    fixture.logger.info('All records are visible after reset');
});
