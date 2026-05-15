import { expect, Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";
import LoginPage from "./loginPage";

export default class DashBoardPage {
  private base: PlaywrightWrapper;

  constructor(private page: Page) {
    this.base = new PlaywrightWrapper(page);
  }

  private Elements = {
    profileIcon: "//span[contains(@class,'userBadge')]",
    logoutButton: "//a[normalize-space()='Logout']"
  };

  async clickOnProfileIcon() {
    await this.base.waitAndClick(this.Elements.profileIcon);
  }

  async clickOnLogoutButton() {
    await this.base.waitAndClick(this.Elements.logoutButton);
  }

  
  async navigateBackToLoginPage() {
    await this.base.waitForURL("/login");
  }
}
