@api
Feature: Auth API

  Scenario: Successful authentication returns user data
    When I send a login request with email "bronze@test.com" and password "password123"
    Then the response status should be 200
    And the response body should include success equal to true
    And the response user should not include a password field

  Scenario Outline: Invalid credentials return 401
    When I send a login request with email "<email>" and password "<password>"
    Then the response status should be 401
    And the response error should be "Invalid email or password"

    Examples:
      | email           | password      |
      | bronze@test.com | wrongpassword |
      | nobody@test.com | password123   |

  Scenario: Missing email returns 400
    When I send a login request with only password "password123"
    Then the response status should be 400
    And the response error should contain "Missing required fields"

  Scenario: Missing password returns 400
    When I send a login request with only email "bronze@test.com"
    Then the response status should be 400
    And the response error should contain "Missing required fields"
