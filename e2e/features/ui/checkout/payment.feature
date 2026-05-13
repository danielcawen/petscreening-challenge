@ui
Feature: Payment form

  # Payment form only renders after billing is set (distance must be entered).
  Background:
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page
    And I select the "Manual" location mode
    And I enter a distance of "5" km

  Scenario: Payment card is visible after entering a distance
    Then the Payment card should be visible

  Scenario: Payment card shows all required fields
    Then the Payment card should show the "Name on card" field
    And the Payment card should show the "Card number" field
    And the Payment card should show the "Expiry" field
    And the Payment card should show the "CVV" field

  Scenario: Card number is formatted with groups of four digits
    When I fill in a randomly generated card number
    Then the card number should be formatted in groups of four digits

  Scenario: Expiry is formatted with a space-slash-space separator
    When I fill in a randomly generated expiry date
    Then the expiry should be formatted correctly

  Scenario: CVV strips non-numeric characters
    When I fill in a CVV containing only letters
    Then the CVV value should be empty

  Scenario: CVV is capped at four digits
    When I fill in a CVV with more than four digits
    Then the CVV should only show the first four digits
