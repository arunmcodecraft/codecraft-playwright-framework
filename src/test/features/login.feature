Feature: Login Feature

  Background:
    Given User navigates to the application

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @smoke
  Scenario: Login with valid credentials

    When User logs in with username "<username>" and password "<password>"
    Then User should be landed to Dashboard page
    # Then Verify username "<username>" has list "<items>" is parsed successfuly
    # Then Verify "<items>" is parsed successfuly
    # # Then Verify "<list>" is parsed successfuly

  @dataFile:helper/util/test-data/loginData.json 
  @Key:Login_03 @sanity
  Scenario: Login with invalid credentials
    When User logs in with username "<userName>" and password "<password>"
    Then Login should fail with error message "Invalid credentials"
