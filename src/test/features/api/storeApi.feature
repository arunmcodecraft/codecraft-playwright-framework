@api
Feature: Store API Automation

  @Key:API_Inventory_01 @Case:INV_POS_01 @inventory @positive @regression
  Scenario: Validate inventory API response contract - positive
    Given User initializes petstore API client
    And User loads API case data
    When User sends API request
    Then API response status code should be "<expected.status>"
    And API response content type should contain "<expected.contentTypeContains>"
    And API response schema should be "<expected.schema>"
    And API response body should match expected values

  @Key:API_Inventory_01 @Case:INV_NEG_01 @inventory @negative @regression
  Scenario: Validate inventory API response contract - negative
    Given User initializes petstore API client
    And User loads API case data
    When User sends API request
    Then API response status code should be "<expected.status>"
    And API response content type should contain "<expected.contentTypeContains>"
    And API response schema should be "<expected.schema>"
    And API response body should match expected values

  @Key:API_Order_01 @Case:ORD_POS_01 @order @positive @regression
  Scenario: Create store order and validate response contract - positive
    Given User initializes petstore API client
    And User loads API case data
    When User sends "<request.method>" request to "<request.path>" with payload id "<request.body.id>" petId "<request.body.petId>" quantity "<request.body.quantity>" shipDate "<request.body.shipDate>" status "<request.body.status>" complete "<request.body.complete>"
    Then API response status code should be "<expected.status>"
    And API response content type should contain "<expected.contentTypeContains>"
    And API response schema should be "<expected.schema>"
    And API response body should match expected values

  @Key:API_Order_01 @Case:ORD_NEG_01 @order @negative @regression
  Scenario: Create store order and validate response contract - negative
    Given User initializes petstore API client
    And User loads API case data
    When User sends API request
    Then API response status code should be "<expected.status>"
    And API response content type should contain "<expected.contentTypeContains>"
    And API response schema should be "<expected.schema>"
    And API response body should match expected values

  @Key:API_Order_Chain_01 @Case:CHAIN_POS_01 @order @positive @regression @chain
  Scenario: Chain APIs using previous response data
    Given User initializes petstore API client
    And User loads API case data
    When User sends API request
    Then API response status code should match active expected value
    And User stores response field "body.id" as "orderId"
    When User sends follow-up API request
    Then API response status code should match active expected value
    And API response content type should contain "application/json"
    And API response body should match expected values
    And API response field "body.id" should equal context key "orderId"
