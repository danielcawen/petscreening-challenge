@ui
Feature: Delivery date and time

  Background:
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page

  Scenario: Selecting a past date shows a validation error
    When I set the delivery date to yesterday
    Then I should see the date error "This date is in the past"

  Scenario: Selecting a valid future weekday date shows a confirmation
    When I set the delivery date to next weekday
    Then I should see the date message "Available for delivery"

  Scenario: Setting a time before 8 AM shows an out-of-hours error
    When I set the delivery time to "07:00"
    Then I should see the time error "Outside delivery hours"

  Scenario: Setting a time after 10 PM shows an out-of-hours error
    When I set the delivery time to "23:00"
    Then I should see the time error "Outside delivery hours"

  Scenario: Selecting a weekend date shows the weekend rate badge
    When I set the delivery date to next Saturday
    Then I should see a "Weekend rate applies" badge
