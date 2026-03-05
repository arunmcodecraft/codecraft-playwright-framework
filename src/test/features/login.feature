Feature: Login Feature

  @Key:Contact_01 @smoke 
  Scenario: Login with valid credentials and logout
    Given User navigates to the application
    When User logs in with username "<username>" and password "<password>"
    Then Login should be successful
    And Logout from application
