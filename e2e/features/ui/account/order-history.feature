@ui
Feature: Order history

  Background:
    Given I am at the checkout with a logged in user and an item in the cart
    And I place the order

  Scenario: Placed order appears in order history when searched by ID
    When I search for my order
    Then my order is listed and the information displayed is correct

    # Then I should be on the confirmation page
    # And I save the order ID and grand total from the confirmation page
    # When I navigate to the order history page
    # And I expand the order history filters
    # And I search for the order by its ID
    # Then the "No orders found" message should not be displayed
    # And the order card should show the correct order ID
    # And the order card should show the correct grand total
    # When I expand the order card
    # Then the order items should include "Signature Cherry Lattice"
