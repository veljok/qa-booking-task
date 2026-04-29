# QA Automation Project – Booking.com

This project contains automated end-to-end tests for Booking.com using:

- Playwright 
- CodeceptJS

Tests cover UI interactions, filters, search behavior, and edge cases.
# Project Structure


qa-booking-test/
│
├── .github/workflows/
│
├── Codecept/ 
│ ├── codecept-tests/ # CodeceptJS Test files
│ │ ├── booking-search_test.js
│ │ ├── edge-cases_test.js
│ │ ├── filters_test.js
│ │ ├── interactions_test.js
│ │
│ ├── output/ # Test reports & screenshots
│ ├── codecept.conf.js
│ ├── steps_file.js
│ ├── package.json
│ ├── package-lock.json
│ ├── jsconfig.json
│ ├── steps.d.ts
│
├── tests/ # Playwright test files
│ ├── booking-search.spec.js
│ ├── edge-cases.spec.js
│ ├── filters.spec.js
│ ├── interactions.spec.js
│ ├── example.spec.js
│
├── test-results/ # Playwright reports/artifacts
│
├── playwright.config.js
├── package.json
├── package-lock.json
├── .gitignore

# How to Run Tests

This project contains two separate test suites:

1. Playwright tests 
2. CodeceptJS tests 

You can run them independently.

1. Running Playwright Tests (Recommended First)

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
