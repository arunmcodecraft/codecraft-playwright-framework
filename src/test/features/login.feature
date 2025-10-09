Feature: Login Feature

  @Key=Login_01 @sanity
  Scenario: Login with valid credentials
    Given User navigates to the application
    When User logs in
    Then User should be landed to Dashboard page

  @Key=Login_01 @smoke
  Scenario: Login with invalid credentials
    Given User navigates to the application
    When User logs in
    Then Login should fail with error message "Invalid credentials"