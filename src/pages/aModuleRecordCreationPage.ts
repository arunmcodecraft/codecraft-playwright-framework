import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";

export default class ModuleRecordPage {
    private base: PlaywrightWrapper;

    constructor(private page: Page) {
        this.base = new PlaywrightWrapper(page);
    }
 
    private Elements = {
        moduleIcon: "//span[normalize-space()='MODULE :']",
        searchInput: "//div[contains(@class,'groupSearch-u80fft')]//input[contains(@placeholder,'Search')]",
        aModButton: "//button[normalize-space()='A MOD']",
        moduleHeader: "//span[@class='moduleUnderline']",
        addButton: "//button[normalize-space()='Add']",
        beginButton: "//button[normalize-space()='Begin']",

        //form Fields
        firstNameInput:"//input[@id='stringField']",
        phoneNumberInput: '(//input[@placeholder="Enter here..."])[2]',
        radioButton:"//label[normalize-space()='A']//div[@class='custom-radio custom-control']",
        dateInput:"//input[@placeholder='DD-MM-YYYY']",
        nextMonthButton: "//button[@aria-label='Next Month']",
        monthYearHeader:"//div[@class='react-datepicker__current-month']",
        dayButton: (day: number) =>  `//div[contains(@aria-label, ' ${day}') and contains(@aria-label, ',')]`,
        timeInput:"//input[@placeholder='HH:MM:SS AM/PM']",
        hourOption: (hour: string) => `//li[contains(@class, 'rc-time-picker-panel-select-option')][normalize-space()='${hour}']`,
        minuteOption: (minute: string) => `//li[contains(@class, 'rc-time-picker-panel-select-option')][normalize-space()='${minute}']`,
        secondOption: (second: string) => `//li[contains(@class, 'rc-time-picker-panel-select-option')][normalize-space()='${second}']`,
        ampmOption: (period: string) => `//li[contains(@class, 'rc-time-picker-panel-select-option')][normalize-space()='${period}']`,
        fileInput:"//button[normalize-space()='Browse File']",
        submitButton:"//button[normalize-space()='Submit']",
        selectDropdown: '//div[@class="css-17jol51-control"]/div[2]',
        selectOption: '//div[@class="css-1jknvbe-menu"]//*[contains(translate(text(), "NO", "no"), "no")]',
        
        ellipsisMenu: '//button[@class="btn btn-link"]',
        saveAndExitOption:"//button[text()='Save & Exit']",
        deleteOption: '//button[text()="Delete"]',

    }

    async clickModuleIcon() {
        await this.base.waitAndClick(this.Elements.moduleIcon);
        await this.page.waitForTimeout(1000);
    }

    async searchAndSelectModule() {
            console.log('Clicking module icon...');
            await this.clickModuleIcon();
            
            console.log('Waiting for search input...');
            const searchInput = this.page.locator(this.Elements.searchInput);
            await searchInput.waitFor({ state: 'visible', timeout: 10000 });
            
            console.log('Typing in search input...');
            await searchInput.fill('A MOD');
            await this.page.waitForTimeout(500);
            
            console.log('Clicking A MOD button...');
            const aModButton = this.page.locator(this.Elements.aModButton);
            await aModButton.waitFor({ state: 'visible', timeout: 10000 });
            await aModButton.click();
            
            console.log('Verifying module screen...');
            await this.verifyModuleScreenOpened();
    
    }

    async verifyModuleScreenOpened() {
        const headerLocator = this.page.locator(this.Elements.moduleHeader);
        await expect(headerLocator).toBeVisible({ 
            timeout: 15000
        });
    }

    async clickAddButton(){
       const addButton = this.page.locator(this.Elements.addButton);
            await addButton.waitFor({ state: 'visible', timeout: 10000 });
            await addButton.click();
    }

    async clickBeginButton(){
        const beginButton = this.page.locator(this.Elements.beginButton);
            await beginButton.waitFor({ state: 'visible', timeout: 10000 });
            await beginButton.click();
            await this.page.waitForTimeout(3000);

    }

    async clickSubmitButton(){
            await this.base.waitAndClick(this.Elements.submitButton);
    }

    async selectDate(day: number, month: string, year: number) {
    
        await this.base.waitAndClick(this.Elements.dateInput);
        
        const targetMonthYear = `${month} ${year}`;
        
        // clicking next/previous until we reach the target month and year
        while (true) {
            const currentMonthYear = await this.page.locator(this.Elements.monthYearHeader).textContent();
            
            if (currentMonthYear === targetMonthYear) {
                break; 
            }
            
            // Click next or previous button
            const currentDate = new Date(currentMonthYear + ' 1, ' + year);
            const targetDate = new Date(month + ' 1, ' + year);
            
            if (targetDate > currentDate) {
                await this.base.waitAndClick(this.Elements.nextMonthButton);
            } else {
                await this.base.waitAndClick("//button[@aria-label='Previous Month']");
            }
            
            await this.page.waitForTimeout(300); 
        }
        
        // Click the day
        await this.base.waitAndClick(this.Elements.dayButton(day));
}

     async selectTime(hour: number, minute: number, second: number, period: 'am' | 'pm' = 'am') {
        // Format time values
        const format = (num: number) => num < 10 ? `0${num}` : `${num}`;
        const formattedPeriod = period.toLowerCase();

        // Open time picker
        await this.base.waitAndClick(this.Elements.timeInput);
        await this.page.waitForTimeout(500); 

        // Select time values
        await this.base.waitAndClick(this.Elements.hourOption(format(hour)));
        await this.base.waitAndClick(this.Elements.minuteOption(format(minute)));
        await this.base.waitAndClick(this.Elements.secondOption(format(second)));
        await this.base.waitAndClick(this.Elements.ampmOption(formattedPeriod));
}

async selectFromDropdown() { 
        // // Click the dropdown to open it
       await  this.base.waitAndClick(this.Elements.selectDropdown);
        
        // Wait for the dropdown options to be visible
         await this.base.waitAndClick(this.Elements.selectOption);
    
}


    async fillCompleteForm() {
            // Fill first name
            await this.base.typeText(this.Elements.firstNameInput, 'Anupama_M');
            await this.page.waitForTimeout(500);
            // const enteredFirstName = await this.page.locator(this.Elements.firstNameInput).inputValue();
            // expect(enteredFirstName).toBe('Anupama_M');
            // console.log(`Entered first name: ${enteredFirstName}`);
        
           // Fill phone number
          await this.base.typeText(this.Elements.phoneNumberInput, '123456789');
          await this.page.waitForTimeout(500);
        //   const enteredPhoneNumber = await this.page.locator(this.Elements.phoneNumberInput).inputValue();
        //   expect(enteredPhoneNumber).toBe('123456789');
        //   console.log(`Entered phone number: ${enteredPhoneNumber}`);
        //   await this.page.waitForTimeout(2000);       
            
            // Select radio button
            await this.base.waitAndClick(this.Elements.radioButton);

            await this.selectDate(10, 'December', 2025);
            //await this.selectTime(2, 15, 30, 'pm');

            
            // Fill time (format: HH:MM:SS AM/PM)
            await this.base.typeText(this.Elements.timeInput, '05:30:00 PM');
            await this.page.waitForTimeout(2000);
            
            
            // Upload file
            const filePath = 'C:/Users/Anupama/Desktop/igz testdata.txt';
            const fileChooserPromise = this.page.waitForEvent('filechooser');
            await this.page.locator(this.Elements.fileInput).click();
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(filePath);

            // Select from dropdown 
            await this.selectFromDropdown();
            

    }

//click ellipsis menu
async clickEllipsisMenu() {
        await this.base.waitAndClick(this.Elements.ellipsisMenu);
        await this.page.waitForTimeout(500); // Small delay for menu to open
    }

    // click save and exit button
    async clickSaveAndExit() {
        await this.clickEllipsisMenu();
        await this.base.waitAndClick(this.Elements.saveAndExitOption);

    }

    async clickDelete() {
        await this.clickEllipsisMenu();
        await this.base.waitAndClick(this.Elements.deleteOption);
    }

}