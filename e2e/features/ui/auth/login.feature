@ui
Feature: Login

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter email "bronze@test.com" and password "password123"
    And I submit the login form
    Then I should be redirected to the account page

  Scenario: Failed login with incorrect password
    Given I am on the login page
    When I enter email "bronze@test.com" and password "wrongpassword"
    And I submit the login form
    Then I should see an error message "Invalid email or password"

  Scenario: Failed login with unrecognized email
    Given I am on the login page
    When I enter email "nobody@test.com" and password "password123"
    And I submit the login form
    Then I should see an error message "Invalid email or password"
