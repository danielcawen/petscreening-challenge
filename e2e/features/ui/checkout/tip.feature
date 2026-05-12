@ui
Feature: Add a tip for your drone pilot

  # Background enters distance so billing is set — TipSelector renders with 18% preset active.
  Background:
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page
    And I select the "Manual" location mode
    And I enter a distance of "5" km

  Scenario: 18% tip preset is active by default
    Then the 18% tip button should be active

  Scenario: Default 18% tip shows the correct amount hint
    Then I should see the correct 18% tip hint

  Scenario: Selecting 15% activates that button and updates the hint
    When I select the 15% tip
    Then the 15% tip button should be active
    And the 18% tip button should be inactive
    And I should see the correct 15% tip hint

  Scenario: Selected tip appears in the Order Summary
    When I select the 15% tip
    Then the tip in the Order Summary should reflect 15%
    And the Order Summary grand total should reflect a 15% tip

  Scenario: Selecting No Tip removes the tip from the Order Summary
    When I select no tip
    Then the no tip button should be active
    And the Order Summary should not show a tip line

  Scenario: Selecting Custom shows the tip amount input
    When I select a custom tip
    Then the custom tip input should be visible

  Scenario: A custom tip amount is applied to the Order Summary
    When I select a custom tip
    And I enter a custom tip amount of "10.00"
    Then the tip in the Order Summary should be "$10.00"
    And the Order Summary grand total should reflect a "10.00" custom tip

  Scenario: A negative custom tip shows a validation error
    When I select a custom tip
    And I enter a custom tip amount of "-5"
    Then I should see a validation error "Tip cannot be negative"

  Scenario: A custom tip over $100 shows a validation error
    When I select a custom tip
    And I enter a custom tip amount of "150"
    Then I should see a validation error "Maximum tip is $100"
