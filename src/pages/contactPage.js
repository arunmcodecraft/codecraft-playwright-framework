const { expect } = require("@playwright/test");
const PlaywrightWrapper = require("../helper/wrapper/PlaywrightWrappers");

class ContactPage {
    constructor(page, logger) {
        this.page = page;
        this.logger = logger;
        this.base = new PlaywrightWrapper(page, logger);
        this.Elements = {
            contactLink: "//a[text()='Contact']",
            firstNameInput: "#wpforms-161-field_0",
            lastNameInput: "#wpforms-161-field_0-last",
            emailInput: "#wpforms-161-field_1",
            messageInput: "#wpforms-161-field_2",
            contactPageTitle: "Contact | Practice Test Automation | Selenium WebDriver"
        };
    }

    async navigateToContactPage() {
        await this.base.waitAndClick(this.Elements.contactLink, "Contact Link");
        await expect(this.page).toHaveTitle(this.Elements.contactPageTitle);
        await this.logger.info("Navigated to Contact page");
    }

    async enterFirstName(firstName) {
        await this.base.typeText(this.Elements.firstNameInput, firstName, "First Name");
    }

    async enterLastName(lastName) {
        await this.base.typeText(this.Elements.lastNameInput, lastName, "Last Name");
    }

    async enterEmail(email) {
        await this.base.typeText(this.Elements.emailInput, email, "Email");
    }

    async enterMessage(message) {
        await this.base.typeText(this.Elements.messageInput, message, "Message");
    }

    async fillContactForm(firstName, lastName, email, message) {
        await this.enterFirstName(firstName);
        await this.enterLastName(lastName);
        await this.enterEmail(email);
        await this.enterMessage(message);
        await this.logger.info("Contact form filled successfully");
    }

    async verifyFormFilled() {
        const firstNameValue = await this.page.inputValue(this.Elements.firstNameInput);
        const lastNameValue = await this.page.inputValue(this.Elements.lastNameInput);
        const emailValue = await this.page.inputValue(this.Elements.emailInput);
        const messageValue = await this.page.inputValue(this.Elements.messageInput);

        const isFilled = !!(firstNameValue && lastNameValue && emailValue && messageValue);
        if (isFilled) {
            await this.logger.info("Contact form verified as filled successfully");
        }
        return isFilled;
    }

    async verifyContactPageLoaded() {
        await expect(this.page).toHaveTitle(this.Elements.contactPageTitle);
        await this.base.waitForElement(this.Elements.firstNameInput);
        await this.logger.info("Contact page loaded successfully");
    }
}

module.exports = ContactPage;
