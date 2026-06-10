Feature: Login Feature

Background:
  Given User navigates to the application

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @smoke
  Scenario: Login with valid credentials
    When User logs in with username "<username>" and password "<password>"
    Then User should be landed to Dashboard page

  @dataFile:helper/util/test-data/loginData.json
  @Key:Login_03 @smoke
  Scenario: Login with invalid username
    When User logs in with username "<userName>" and password "<password>"
    Then Login should fail with error message "Username does not exist!"

  @dataFile:helper/util/test-data/loginData.json
  @Key:Login_04 @smoke
  Scenario: Login with invalid password
    When User logs in with username "<userName>" and password "<password>"
    Then Check the "Incorrect password!" error message
