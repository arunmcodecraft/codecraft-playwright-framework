Feature: Dashboard Feature

  @Key:Login_01 @smoke
  Scenario: Logout the user
    Given User navigates to the application
    When User logs in with username "<username>" and password "<password>"
    Then User should be landed to Dashboard page
    When User clicks on the profile icon
    And Clicks on the Logout button
    And Click on Yes button on the logout popup
    Then User should logout and navigated to Login Page