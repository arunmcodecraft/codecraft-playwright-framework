Feature: Dashboard Feature

Background:
    Given User navigates to the application
    When User logs in with username "<username>" and password "<password>"
    
  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @smoke
  Scenario: Logout the user
  
    Then User should be landed to Dashboard page
    When User clicks on the profile icon
    And Clicks on the Logout button
    Then User should logout and navigated to Login Page