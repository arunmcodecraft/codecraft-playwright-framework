const { expect } = require("@playwright/test");
const PlaywrightWrapper = require("../helper/wrapper/PlaywrightWrappers");

class AModuleFilterPage {
    constructor(page, logger) {
        this.page = page;
        this.base = new PlaywrightWrapper(page, logger);
    }

    Elements = {
        filterButton: "//button[contains(@class, 'filterButton-') and not(contains(@class, 'addNewfilterButton'))]",
            statusFilterSection: "//div[contains(@class, 'filterElement')]//button[normalize-space()='Status']",
        filterSectionTab: (filterName) => `//button[contains(@class,'trigger-') and normalize-space() = '${filterName}']`,
        filterOptionLabel: (option) => `//div[contains(@class,'panel-')]//label[normalize-space() = '${option}']`,
        statusOptionInput: (status) => `//label[normalize-space() = '${status}']/preceding-sibling::input[@type='checkbox']`,
        customDateFromInput: "//input[@placeholder='From Date']",
        customDateToInput: "//input[@placeholder='To Date']",
        datePickerMonthYearHeader: "//div[contains(@class,'react-datepicker__current-month')]",
        datePickerNextMonthButton: "//button[@aria-label='Next Month']",
        datePickerPreviousMonthButton: "//button[@aria-label='Previous Month']",
        datePickerDayButton: function(day) {
            return `//div[contains(@aria-label, ' ${day}') and contains(@aria-label, ',')]`;
        },
        clearAllButton: "//a[normalize-space()='Clear All'] | //button[normalize-space()='Clear All']",
        activeFilterItems: "//ul[contains(@class,'activeFiltersBar')]//li[contains(@class,'activeFilterItem')]",
        activeFilterBadge: (filterName, option) => `//ul[contains(@class,'activeFiltersBar')]//li[.//span[normalize-space() = '${filterName}:'] and .//span[normalize-space() = '${option}']]`,
        applyButton: "//button[normalize-space()='Apply']",
        resetButton: "//button[normalize-space()='Reset']",
        tableStatusColumn: "//td[contains(@class, 'status') or preceding-sibling::th[contains(text(), 'Status')]]",
        tableRow: "//tr[td]"
    }

    async clickFilterButton() {
        console.log('Clicking filter button...');
        const filterButton = this.page.locator(this.Elements.filterButton);
        await filterButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.base.waitAndClick(this.Elements.filterButton);
        await this.page.waitForTimeout(1000);
        console.log('Filter button clicked successfully');
    }

    async expandFilterSection(filterName) {
        console.log(`Expanding ${filterName} filter section...`);
        const filterSection = this.page.locator(this.Elements.filterSectionTab(filterName));
        await filterSection.waitFor({ state: 'visible', timeout: 10000 });
        await this.base.waitAndClick(this.Elements.filterSectionTab(filterName));
        await this.page.waitForTimeout(500);
        console.log(`${filterName} filter section expanded`);
    }

    async selectFilterOption(option) {
        console.log(`Selecting filter option: ${option}`);
        const optionLocator = this.page.locator(this.Elements.filterOptionLabel(option));
        await optionLocator.waitFor({ state: 'visible', timeout: 10000 });
        await this.base.waitAndClick(this.Elements.filterOptionLabel(option));
        await this.page.waitForTimeout(500);
        console.log(`Filter option ${option} selected successfully`);
    }

    parseDateString(dateString) {
        const parts = dateString.split(/[-\/]/).map((part) => part.trim());
        if (parts.length !== 3) {
            throw new Error(`Invalid date format: ${dateString}. Expected DD-MM-YYYY or DD/MM/YYYY.`);
        }

        const [dayPart, monthPart, yearPart] = parts;
        const day = parseInt(dayPart, 10);
        const year = parseInt(yearPart, 10);
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        let month;

        if (/^\d+$/.test(monthPart)) {
            const monthIndex = parseInt(monthPart, 10) - 1;
            if (monthIndex < 0 || monthIndex > 11) {
                throw new Error(`Invalid month number in date: ${dateString}`);
            }
            month = monthNames[monthIndex];
        } else {
            const normalized = monthPart.replace(/\./g, '').toLowerCase();
            month = monthNames.find((m) => m.toLowerCase().startsWith(normalized));
            if (!month) {
                throw new Error(`Invalid month name in date: ${dateString}`);
            }
        }

        return { day, month, year };
    }

    async selectDateInPicker(day, month, year) {
        const targetMonthYear = `${month} ${year}`;

        await this.page.locator(this.Elements.datePickerMonthYearHeader).first().waitFor({ state: 'visible', timeout: 10000 });

        while (true) {
            const currentMonthYear = (await this.page.locator(this.Elements.datePickerMonthYearHeader).first().textContent()).trim();
            if (currentMonthYear === targetMonthYear) {
                break;
            }

            const [currentMonth, currentYear] = currentMonthYear.split(' ');
            const currentDate = new Date(`${currentMonth} 1, ${currentYear}`);
            const targetDate = new Date(`${month} 1, ${year}`);
            if (targetDate > currentDate) {
                await this.base.waitAndClick(this.Elements.datePickerNextMonthButton);
            } else {
                await this.base.waitAndClick(this.Elements.datePickerPreviousMonthButton);
            }
            await this.page.waitForTimeout(300);
        }

        const dayLocator = this.page.locator(this.Elements.datePickerDayButton(day));
        await dayLocator.first().waitFor({ state: 'visible', timeout: 10000 });
        await dayLocator.first().click();
        await this.page.waitForTimeout(500);
    }

    async selectCustomDateRange(fromDate, toDate) {
        console.log(`Selecting custom date range from ${fromDate} to ${toDate}`);
        const { day: fromDay, month: fromMonth, year: fromYear } = this.parseDateString(fromDate);
        const { day: toDay, month: toMonth, year: toYear } = this.parseDateString(toDate);

        const fromInput = this.page.locator(this.Elements.customDateFromInput);
        await fromInput.waitFor({ state: 'visible', timeout: 10000 });
        await fromInput.click();
        await this.selectDateInPicker(fromDay, fromMonth, fromYear);

        const toInput = this.page.locator(this.Elements.customDateToInput);
        await toInput.waitFor({ state: 'visible', timeout: 10000 });
        await toInput.click();
        await this.selectDateInPicker(toDay, toMonth, toYear);

        console.log(`Custom date range selected: ${fromDate} to ${toDate}`);
    }

    async deselectFilterOption(option) {
        console.log(`Deselecting filter option: ${option}`);
        const optionLocator = this.page.locator(this.Elements.filterOptionLabel(option));
        await optionLocator.waitFor({ state: 'visible', timeout: 10000 });
        await this.base.waitAndClick(this.Elements.filterOptionLabel(option));
        await this.page.waitForTimeout(500);
        console.log(`Filter option ${option} deselected successfully`);
    }

    async verifyStatusCheckboxState(statuses, shouldBeChecked) {
        console.log(`Verifying status checkbox state for: ${statuses.join(', ')} shouldBeChecked=${shouldBeChecked}`);
        for (const status of statuses) {
            const checkbox = this.page.locator(this.Elements.statusOptionInput(status));
            await checkbox.waitFor({ state: 'attached', timeout: 10000 });
            const isChecked = await checkbox.isChecked();
            console.log(`Status checkbox '${status}' isChecked=${isChecked}`);
            expect(isChecked).toBe(shouldBeChecked);
        }
        console.log('Status checkbox state verified');
    }

    async clickClearAllButton() {
        console.log('Clicking Clear All button...');
        const clearAllButton = this.page.locator(this.Elements.clearAllButton);
        await clearAllButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.base.waitAndClick(this.Elements.clearAllButton);
        await this.page.waitForTimeout(2000);
        console.log('Clear All button clicked successfully');
    }

    async verifyActiveFiltersCleared() {
        console.log('Verifying active filters are cleared...');
        const clearAllButton = this.page.locator(this.Elements.clearAllButton);
        expect(await clearAllButton.count()).toBe(0);
        const activeFilters = this.page.locator(this.Elements.activeFilterItems);
        expect(await activeFilters.count()).toBe(0);
        console.log('Active filters are cleared');
    }

    async verifyActiveFilterBadge(filterName, option) {
        console.log(`Verifying active filter badge for ${filterName}: ${option}`);
        const activeFilterBadge = this.page.locator(this.Elements.activeFilterBadge(filterName, option));
        await activeFilterBadge.waitFor({ state: 'visible', timeout: 10000 });
        expect(await activeFilterBadge.count()).toBeGreaterThan(0);
        console.log(`Active filter badge verified for ${filterName}: ${option}`);
    }

    async clickApplyButton() {
        console.log('Clicking Apply button...');
        const applyButton = this.page.locator(this.Elements.applyButton);
        await applyButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.base.waitAndClick(this.Elements.applyButton);
        await this.page.waitForTimeout(2000);
        console.log('Apply button clicked successfully');
    }

    async clickResetButton() {
        console.log('Clicking Reset button...');
        const resetButton = this.page.locator(this.Elements.resetButton);
        await resetButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.base.waitAndClick(this.Elements.resetButton);
        await this.page.waitForTimeout(2000);
        console.log('Reset button clicked successfully');
    }

    async verifyAllRecordsHaveStatus(expectedStatus) {
        console.log(`Verifying all records have status: ${expectedStatus}`);
        const tableRows = this.page.locator(this.Elements.tableRow);
        const rowCount = await tableRows.count();
        console.log(`Found ${rowCount} rows in the table`);

        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            const statusText = await row.textContent();
            console.log(`Row ${i + 1} status: ${statusText}`);
            expect(statusText).toContain(expectedStatus);
        }
        console.log(`All records verified to have status: ${expectedStatus}`);
    }

    async verifyAllRecordsAreVisible() {
        console.log('Verifying all records are visible after reset');
        const tableRows = this.page.locator(this.Elements.tableRow);
        const rowCount = await tableRows.count();
        console.log(`Found ${rowCount} rows in the table after reset`);
        expect(rowCount).toBeGreaterThan(0);
        console.log('Records are visible after reset');
    }
}

module.exports = AModuleFilterPage;
