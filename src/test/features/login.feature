Feature: User Authentication tests

  Background:
    Given User navigates to the application
    
@regression @smoke
Scenario Outline: Mandatory Email input validation error message [<TestCaseID>]
    When User Clicks on Useraname field
    And User Clicks on password field
    Then Check the "Please enter the email" error message

     Examples:
      | TestCaseID |
      | Login_01   |

@regression
Scenario Outline: Login with invalid credentials [<TestCaseID>]
    Given User navigates to the application
    When User logs in
    Then Login should fail with error message "Invalid credentials"

    Examples:
      | TestCaseID |
      | Login_01   |
    

@sanity
Scenario Outline: Login with valid credentials [<TestCaseID>]
    Given User navigates to the application
    When User logs in
    Then User should be landed to Dashboard page

    Examples:
      | TestCaseID |
      | Login_02   |
  


