Feature: Dashboard Feature

  @Key:Login_01 @staging
  Scenario: Logout the user
    Given User navigates to the application
    When User logs in with username "QAa" and password "igz123"
    Then User should be landed to Dashboard page
    When User clicks on the profile icon
    And Clicks on the Logout button
    Then User should logout and navigated to Login Page
