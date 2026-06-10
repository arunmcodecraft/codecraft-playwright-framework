Feature: Filter Functionality in A Mod Module

  Background:
    Given User navigates to the application
    When User logs in with username "<username>" and password "<password>"
    And User searches and selects the module named "A Mod"
    And User navigates to the "A Mod" screen

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Filter A Mod records by Status "Closed"
    When User clicks on the filter button next to Summary
    And User expands the "Status" filter section
    And User selects "Closed" from the "Status" filter options
    And User clicks on the "Apply" button
    Then User should see only records with "Closed" status in the A Mod screen

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Filter A Mod records by Status "In Progress"
    When User clicks on the filter button next to Summary
    And User expands the "Status" filter section
    And User selects "In Progress" from the "Status" filter options
    And User clicks on the "Apply" button
    Then User should see only records with "In Progress" status in the A Mod screen

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01  @staging
  Scenario: Filter A Mod records by Date "Today"
    When User clicks on the filter button next to Summary
    And User expands the "Date" filter section
    And User selects "Today" from the "Date" filter options
    And User clicks on the "Apply" button
    Then active filter Date should display "Today"

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Filter A Mod records by Date "Yesterday"
    When User clicks on the filter button next to Summary
    And User expands the "Date" filter section
    And User selects "Yesterday" from the "Date" filter options
    And User clicks on the "Apply" button
    Then active filter Date should display "Yesterday"

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01  @staging
  Scenario: Filter A Mod records by Date "Last 7 Days"
    When User clicks on the filter button next to Summary
    And User expands the "Date" filter section
    And User selects "Last 7 Days" from the "Date" filter options
    And User clicks on the "Apply" button
    Then active filter Date should display "Last 7 Days"

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Filter A Mod records by Date "Last Week"
    When User clicks on the filter button next to Summary
    And User expands the "Date" filter section
    And User selects "Last Week" from the "Date" filter options
    And User clicks on the "Apply" button
    Then active filter Date should display "Last Week"

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Filter A Mod records by Date "Month to Date"
    When User clicks on the filter button next to Summary
    And User expands the "Date" filter section
    And User selects "Month to Date" from the "Date" filter options
    And User clicks on the "Apply" button
    Then active filter Date should display "Month to Date"

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Filter A Mod records by Date "Previous Month"
    When User clicks on the filter button next to Summary
    And User expands the "Date" filter section
    And User selects "Previous Month" from the "Date" filter options
    And User clicks on the "Apply" button
    Then active filter Date should display "Previous Month"

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Filter A Mod records by Date "Custom"
    When User clicks on the filter button next to Summary
    And User expands the "Date" filter section
    And User selects "Custom" from the "Date" filter options
    And User selects custom date range from "01-05-2026" to "10-05-2026"
    And User clicks on the "Apply" button
    Then active filter Date should display "May 1, 2026 - May 10, 2026"

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Clear applied Closed status filter using Clear All
    When User clicks on the filter button next to Summary
    And User expands the "Status" filter section
    And User selects "Closed" from the "Status" filter options
    And User clicks on the "Apply" button
    Then User should see only records with "Closed" status in the A Mod screen
    When User clicks on the "Clear All" button
    Then active filters should be cleared
    And User should see all records in the A Mod screen

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Clear applied In Progress status filter using Clear All
    When User clicks on the filter button next to Summary
    And User expands the "Status" filter section
    And User selects "In Progress" from the "Status" filter options
    And User clicks on the "Apply" button
    Then User should see only records with "In Progress" status in the A Mod screen
    When User clicks on the "Clear All" button
    Then active filters should be cleared
    And User should see all records in the A Mod screen

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Select All status options in the Status filter
    When User clicks on the filter button next to Summary
    And User expands the "Status" filter section
    And User selects "Select All" from the "Status" filter options
    Then all status filter options should be checked

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Deselect All status options in the Status filter
    When User clicks on the filter button next to Summary
    And User expands the "Status" filter section
    And User selects "Select All" from the "Status" filter options
    And User deselects "Select All" from the "Status" filter options
    Then all status filter options should be unchecked

  @dataFile:helper/util/test-data/testData.csv
  @Key:Login_01 @staging
  Scenario: Reset filters to view all records
    When User clicks on the filter button next to Summary
    And User expands the "Status" filter section
    And User selects "Closed" from the "Status" filter options
    And User clicks on the "Reset" button
    And User clicks on the "Apply" button
    Then User should see all records in the A Mod screen
