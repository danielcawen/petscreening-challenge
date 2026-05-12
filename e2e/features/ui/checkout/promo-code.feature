@ui
Feature: Promo code

  Background:
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page
    And I select the "Manual" location mode
    And I enter a distance of "5" km
    And I select no tip

  Scenario: Promo code section appears after entering a distance
    Then the "Promo code" section should be visible

  Scenario: WELCOME10 applies a 10% discount and reduces the total
    When I apply the promo code "WELCOME10"
    Then the promo code "WELCOME10" should appear as applied
    And the Order Summary promo should reflect 10% off
    And the Order Summary grand total should be correct

  Scenario: SAVE5 applies a $5 fixed discount on a qualifying order
    When I apply the promo code "SAVE5"
    Then the promo code "SAVE5" should appear as applied
    And the Order Summary grand total should be correct

  Scenario: FREEDELIVERY removes the delivery fee entirely
    When I apply the promo code "FREEDELIVERY"
    Then the promo code "FREEDELIVERY" should appear as applied
    And the Order Summary grand total should be correct

  Scenario: EXPIRED2024 shows an expiry error
    When I apply the promo code "EXPIRED2024"
    Then I should see the promo error "expired"

  Scenario: An unknown code shows an invalid code error
    When I apply the promo code "NOTREAL"
    Then I should see the promo error "Invalid promo code"

  Scenario: Removing an applied promo restores the original total
    When I apply the promo code "WELCOME10"
    And I remove the applied promo code
    Then the Order Summary grand total should be correct
