@ui
Feature: Place order

  Background:
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page
    And I select the "Manual" location mode
    And I enter a distance of "5" km
    And I select no tip

  Scenario: Place Order button is disabled before payment details are entered
    Then the Place Order button should be disabled

  Scenario: Place Order button is enabled after all required fields are filled
    When I fill in the payment form with valid details
    Then the Place Order button should be enabled

  Scenario: Successfully placing an order redirects to the confirmation page
    When I fill in the payment form with valid details
    And I click the Place Order button
    Then I should be on the confirmation page

  Scenario: Confirmation page shows a valid order ID
    When I fill in the payment form with valid details
    And I click the Place Order button
    Then I should be on the confirmation page
    And the confirmation should show a valid order ID

  Scenario: Confirmation page shows the ordered item
    When I fill in the payment form with valid details
    And I click the Place Order button
    Then I should be on the confirmation page
    And the confirmation should mention "Signature Cherry Lattice"

  Scenario: Confirmation grand total matches the billing breakdown
    When I fill in the payment form with valid details
    And I click the Place Order button
    Then I should be on the confirmation page
    And the confirmation grand total should be correct
