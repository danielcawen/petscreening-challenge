@ui
Feature: Weather simulation

  Background:
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page

  Scenario: Clear weather is selected by default
    Then the "Clear" weather option should be active
    And the "Raining" weather option should be inactive

  Scenario: Selecting Raining activates the rain option
    When I select the "Raining" weather
    Then the "Raining" weather option should be active
    And the "Clear" weather option should be inactive

  Scenario: Switching back to Clear deactivates rain
    When I select the "Raining" weather
    And I select the "Clear" weather
    Then the "Clear" weather option should be active
    And the "Raining" weather option should be inactive
