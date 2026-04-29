# QA Automation Project – Booking.com

This project contains automated end-to-end tests for Booking.com using:

- Playwright 
- CodeceptJS

Tests cover UI interactions, filters, search behavior, and edge cases.
# Project Structure


**qa-booking-test**

- .github/workflows/ 

- Codecept/
  - codecept-tests/
    - booking-search_test.js
    - edge-cases_test.js
    - filters_test.js
    - interactions_test.js
  - output/ – test reports & screenshots
  - codecept.conf.js
  - steps_file.js
  - jsconfig.json
  - steps.d.ts

- tests/ (Playwright)
  - booking-search.spec.js
  - edge-cases.spec.js
  - filters.spec.js
  - interactions.spec.js
  - example.spec.js

- test-results/ – Playwright artifacts

- playwright.config.js
- package.json
- .gitignore

# How to Run Tests

This project contains two separate test suites:

1. Playwright tests 
2. CodeceptJS tests 

You can run them independently.

1. Running Playwright Tests

Playwright tests are located in: tests/

open a test, open terminal and write:
to run all tests: npx playwright test
to run all Playwright tests in headed mode (see browser): npx playwright test --headed
to run a specific test file: npx playwright test tests/interactions.spec.js

2. Running CodeceptJS Tests

CodeceptJS tests are located in: Codecept/codecept-tests/
to run all CodeceptJS tests: npx codeceptjs run Codecept/codecept-tests
to run a single test file: npx codeceptjs run Codecept/codecept-tests/interactions_test.js --steps
to run with step-by-step output (debug mode): npx codeceptjs run --steps

Notes Before Running Tests
Make sure dependencies are installed: npm install
Install Playwright browsers (required for Playwright + CodeceptJS): npx playwright install
