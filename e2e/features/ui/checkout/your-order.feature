@ui
Feature: Your Order — subtotal math

  Scenario: Line total equals unit price times quantity for a single item
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page
    Then the line totals and subtotal should reflect correct math

  Scenario: Incrementing quantity on checkout updates line total and subtotal
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page
    When I increment the quantity of "Signature Cherry Lattice"
    Then the line totals and subtotal should reflect correct math

  Scenario: Decrementing quantity on checkout updates line total and subtotal
    Given I have "Signature Cherry Lattice" in my cart with quantity 2
    And I am on the checkout page
    When I decrement the quantity of "Signature Cherry Lattice"
    Then the line totals and subtotal should reflect correct math

  Scenario: Subtotal equals sum of line totals across multiple items
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I also have "Apple Crumble" in my cart with quantity 1
    And I am on the checkout page
    Then the line totals and subtotal should reflect correct math

  Scenario: Removing the only cart item redirects to the catalog
    Given I have "Signature Cherry Lattice" in my cart with quantity 1
    And I am on the checkout page
    When I remove "Signature Cherry Lattice" from the cart
    Then I should be redirected to the catalog page
