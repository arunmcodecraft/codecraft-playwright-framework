import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";
import LoginPage from "./loginPage";

export default class DashBoardPage {
  private base: PlaywrightWrapper;

  constructor(private page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  private Elements = {
    profileIcon: '[title="Logout"]',
    logoutButton: '//li[text()=" Logout "]',
    logoutPopupYesButton:'//button[text()=" Yes "]'
  };

  async clickOnProfileIcon() {
    await this.base.waitAndClick(this.Elements.profileIcon);
  }

  async clickOnLogoutButton() {
    await this.base.waitAndClick(this.Elements.logoutButton);
  }

   async clickOnLogoutPopupYesButton() {
    await this.base.waitAndClick(this.Elements.logoutPopupYesButton);
  }
  
  async navigateBackToLoginPage() {
    await this.base.waitForURL("/login");
  }
}
