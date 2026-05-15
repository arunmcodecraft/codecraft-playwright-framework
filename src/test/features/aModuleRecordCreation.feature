Feature: Verify End-to-End Flow for A Mod Form Creation

Background:
    Given User navigates to the application
    When User logs in with username "<username>" and password "<password>"
    And User searches and selects the module named "A Mod"
    And User navigates to the "A Mod" screen
  

@dataFile:helper/util/test-data/testData.csv
@Key:Login_01 @regression

Scenario: User successfully creates and verifies a form in A Mod module
When User searches and selects the module named "A Mod"
And User navigates to the "A Mod" screen
And User clicks on "+Add" button to create a new form
When User fills the complete form with test data
And User clicks on "Begin and submit" button to submit the filled form


@dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @regression
  Scenario: User creates and saves a new form without submitting
    When User clicks on "+Add" button to create a new form
    And User fills the complete form with test data
    And User clicks on the "Begin" button and selects "Save & Exit" from the ellipsis menu

#     @dataFile:helper/util/test-data/testData.csv
#   @Key:Login_01
#   Scenario: User deletes an existing form from submit screen
#     When User opens an existing form
#     Then User should be on the submit screen
#     When User clicks on "Delete" from ellipsis menu
#     And User confirms the deletion
#     Then The form should be deleted