Feature: Contact Form Management

  @Key:Contact_01 @smoke1
  Scenario: Fill contact form with valid data
    Given User navigates to the application
    When User logs in with username "<username>" and password "<password>"
    Then Login should be successful
    And User navigates to Contact page
    When User fills contact form with first name "<firstName>", last name "<lastName>", email "<email>" and message "<message>"
    Then Contact form should be filled successfully
