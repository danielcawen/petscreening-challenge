@ui
Feature: Delivery location — setting the delivery address

  Background:
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page

  Scenario: Address mode is selected by default
    Then the "Address" location mode should be active

  Scenario: Address mode shows an address input and a Look up button
    Then an address input field should be visible
    And a "Look up" button should be visible

  Scenario: Switching to Manual mode reveals the distance input
    When I select the "Manual" location mode
    Then a distance input field should be visible

  Scenario: Entering a valid short distance in Manual mode shows success
    When I select the "Manual" location mode
    And I enter a valid near-range distance
    Then I should see the distance message "Distance accepted"

  Scenario: Entering a long-range distance shows a warning
    When I select the "Manual" location mode
    And I enter an out-of-range distance
    Then I should see the distance message "Distance exceeds typical drone range"

  Scenario: Entering zero distance shows an error
    When I select the "Manual" location mode
    And I enter a distance of "0" km
    Then I should see the distance message "Distance cannot be zero"

  Scenario: Switching to Slider mode reveals the distance slider
    When I select the "Slider" location mode
    Then a distance slider should be visible

  Scenario: Slider mode is active after switching to it
    When I select the "Slider" location mode
    Then the "Slider" location mode should be active
