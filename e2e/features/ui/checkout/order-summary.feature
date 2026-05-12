@ui
Feature: Order Summary — billing breakdown

  Background:
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page
    And I select the "Manual" location mode
    And I enter a distance of "5" km
    And I select no tip

  Scenario: Order Summary section appears after entering a distance
    Then the "Order Summary" section should be visible

  Scenario: Items row shows the pie subtotal
    Then the Order Summary items row should show the correct subtotal

  Scenario: Grand total equals subtotal plus near-range delivery fee
    Then the Order Summary grand total should be correct

  Scenario: Long-range delivery (over 10 km) applies the $25 fee
    When I enter a distance of "15" km
    Then the Order Summary grand total should be correct

  Scenario: Rain surcharge adds $10 on a weekday delivery
    When I select the "Raining" weather
    Then the Order Summary should contain a line "Rain surcharge" with "$10.00"
    And the Order Summary grand total should be correct

  Scenario: Weekend delivery triggers the $50 flat rate
    When I set the delivery date to next Saturday
    Then the Order Summary should contain a line "Weekend delivery" with "$50.00"
    And the Order Summary grand total should be correct
