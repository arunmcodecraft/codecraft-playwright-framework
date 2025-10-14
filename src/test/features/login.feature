Feature: Login Feature

  @Key:Login_01 @smoke
  Scenario: Login with valid credentials
    Given User navigates to the application
    When User logs in with username "<username>" and password "<password>"
    Then User should be landed to Dashboard page
    # Then Verify username "<username>" has list "<items>" is parsed successfuly
    # Then Verify "<items>" is parsed successfuly
    # # Then Verify "<list>" is parsed successfuly

  @Key:Login_02 @sanity
  Scenario: Login with invalid credentials
    Given User navigates to the application
    When User logs in with username "<username>" and password "<password>"
    Then Login should fail with error message "Invalid credentials"
