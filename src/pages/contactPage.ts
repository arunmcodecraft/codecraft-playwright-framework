import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";
import { HTMLSubStepLogger } from "../support/htmllSubStepLogger";

export default class ContactPage {
    private base: PlaywrightWrapper;

    constructor(private page: Page, private logger: HTMLSubStepLogger) {
        this.base = new PlaywrightWrapper(page, logger);
    }

    private Elements = {
        contactLink: "//a[text()='Contact']",
        firstNameInput: '#wpforms-161-field_0',
        lastNameInput: '#wpforms-161-field_0-last',
        emailInput: '#wpforms-161-field_1',
        messageInput: '#wpforms-161-field_2',
        contactPageTitle: "Contact | Practice Test Automation | Selenium WebDriver"
    }

    async navigateToContactPage() {
        await this.base.waitAndClick(this.Elements.contactLink, 'Contact Link');
        await expect(this.page).toHaveTitle(this.Elements.contactPageTitle);
        this.logger.info("Navigated to Contact page");
    }

    async enterFirstName(firstName: string) {
        await this.base.typeText(this.Elements.firstNameInput, firstName, 'First Name');
    }

    async enterLastName(lastName: string) {
        await this.base.typeText(this.Elements.lastNameInput, lastName, 'Last Name');
    }

    async enterEmail(email: string) {
        await this.base.typeText(this.Elements.emailInput, email, 'Email');
    }

    async enterMessage(message: string) {
        await this.base.typeText(this.Elements.messageInput, message, 'Message');
    }

    async fillContactForm(firstName: string, lastName: string, email: string, message: string) {
        await this.enterFirstName(firstName);
        await this.enterLastName(lastName);
        await this.enterEmail(email);
        await this.enterMessage(message);
        this.logger.info("Contact form filled successfully");
    }

    async verifyFormFilled() {
        // Verify all form fields have values
        const firstNameValue = await this.page.inputValue(this.Elements.firstNameInput);
        const lastNameValue = await this.page.inputValue(this.Elements.lastNameInput);
        const emailValue = await this.page.inputValue(this.Elements.emailInput);
        const messageValue = await this.page.inputValue(this.Elements.messageInput);
        
        const isFilled = !!(firstNameValue && lastNameValue && emailValue && messageValue);
        if (isFilled) {
            this.logger.info("Contact form verified as filled successfully");
        }
        return isFilled;
    }

    async verifyContactPageLoaded() {
        await expect(this.page).toHaveTitle(this.Elements.contactPageTitle);
        await this.base.waitForElement(this.Elements.firstNameInput);
        this.logger.info("Contact page loaded successfully");
    }
}
