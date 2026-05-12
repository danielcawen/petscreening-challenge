@ui
Feature: Cart

  Scenario: Adding an available item shows count in header and bottom bar
    Given I am on the catalog page
    When I add "Signature Cherry Lattice" to the cart
    Then the header cart count should be "1"
    And the bottom bar should show "1 item in cart"

  Scenario: Adding an item twice increases the count to 2
    Given I am on the catalog page
    When I add "Signature Cherry Lattice" to the cart
    And I add "Signature Cherry Lattice" to the cart
    Then the header cart count should be "2"
    And the bottom bar should show "2 items in cart"

  Scenario: Out of stock items cannot be added to the cart
    Given I am on the catalog page
    When I navigate to page 2
    Then the "Georgia Peach" item should show "Out of Stock"
    And the "Georgia Peach" add button should be disabled
