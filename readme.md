# Playwright (JavaScript) + Cucumber (BDD) - Practice Test Automation Framework

Cucumber is a popular behavior-driven development (BDD) tool that allows developers and stakeholders to collaborate on defining and testing application requirements in a human-readable format. 
This framework now uses JavaScript with Cucumber and Playwright for readable and maintainable automated tests.

## 🚀 Quick Start for New Users

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- VS Code (recommended)

### Step-by-Step Setup Guide

#### 1. **Clone and Setup Project**
```bash
# Clone the repository
git clone <repository-url>
cd web-qa-automation-nodejs

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

#### 2. **Understand the Project Structure**
```
src/
├── pages/              # Page Object Models
│   ├── loginPage.js    # Login page interactions
│   └── contactPage.js  # Contact form interactions
├── test/
│   ├── features/       # Gherkin feature files
│   │   ├── login.feature
│   │   └── contact.feature
│   └── steps/          # Step definitions
│       ├── loginSteps.js
│       └── contactSteps.js
├── support/            # Framework support files
│   ├── hooks.js        # Test setup/teardown
│   └── pageFixture.js  # Shared page objects
└── helper/
    ├── env/            # Environment configurations
    │   ├── .env.STG    # Staging environment
    │   └── .env.PRD    # Production environment
    └── util/
        └── test-data/
            └── testData.csv  # Test data file
```

#### 3. **Configure Test Data**
The framework uses CSV files for test data. Edit `src/helper/util/test-data/testData.csv`:

```csv
Key|Env|username|password|firstName|lastName|email|message
Contact_01|STG|student|Password123|John|Doe|john.doe@test.com|This is a test message
Contact_01|DEV|student|Password123|Jane|Smith|jane.smith@test.com|This is a test message from DEV
Contact_01|PRD|student|Password123|Bob|Wilson|bob.wilson@test.com|This is a test message from PRD
```

#### 4. **Run Your First Tests**

**Run all tests:**
```bash
npm run test:all
```

**Run specific test types:**
```bash
# Run smoke tests only
npm run test:smoke

# Run tests with specific tags
npm run test --TAGS="@smoke"

# Run failed tests only
npm run test:failed
```

#### 5. **View Test Results**
After running tests, check the reports:
- **HTML Report**: `test-results/reports/index.html`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/videos/`
- **Logs**: Console output during test execution

#### 6. **Understand How Tests Work**

**Feature Files** (`src/test/features/`):
- Written in Gherkin language
- Define test scenarios in plain English
- Use parameters like `<username>`, `<firstName>` etc.

**Example Feature:**
```gherkin
Feature: Contact Form Management
  @Key:Contact_01 @smoke1
  Scenario: Fill contact form with valid data
    Given User navigates to the application
    And User navigates to Contact page
    When User fills contact form with first name "<firstName>", last name "<lastName>", email "<email>" and message "<message>"
    Then Contact form should be filled successfully
```

**Step Definitions** (`src/test/steps/`):
- JavaScript code that implements feature steps
- Uses Page Object Models for UI interactions
- Handles assertions and test logic

#### 7. **Customize for Your Application**

**To add new tests:**
1. Add test data to `testData.csv`
2. Create new feature file in `src/test/features/`
3. Implement step definitions in `src/test/steps/`
4. Create page objects in `src/pages/`

**To modify existing tests:**
1. Update test data in CSV
2. Modify feature files as needed
3. Update page objects for new UI elements

#### 8. **Environment Configuration**

Edit environment files in `src/helper/env/`:
- `.env.STG` - Staging environment settings
- `.env.PRD` - Production environment settings

**Example .env.STG:**
```env
PROJECT=PracticeTestAutomation
RELEASE=1.0.0
CYCLE=Smoke-1
BASEURL=https://practicetestautomation.com/
BROWSER=chrome
HEAD=true
```

#### 9. **Troubleshooting Common Issues**

**Tests fail with "element not found":**
- Check if the application URL is accessible
- Verify element selectors in page objects
- Ensure proper wait times are used

**Data not loading from CSV:**
- Verify CSV format (pipe `|` delimiter)
- Check if Key tag matches CSV data
- Ensure environment variable is set correctly

**Browser issues:**
- Reinstall Playwright browsers: `npx playwright install`
- Check browser compatibility in config

#### 10. **Best Practices**

- **Page Object Model**: Keep UI interactions separate from test logic
- **Data-Driven Testing**: Use CSV files for test data, avoid hardcoding
- **Descriptive Steps**: Write clear, readable feature files
- **Error Handling**: Add proper assertions and error messages
- **Clean Code**: Follow JavaScript best practices and naming conventions

## Features

1. Awesome report with screenshots, videos & logs
2. Execute tests on multiple environments 
3. Parallel execution
4. Rerun only failed features
5. Retry failed tests on CI
6. Page object model
7. Data-driven testing with CSV files
8. Environment-specific configuration

## Sample report
![Automation Report](https://via.placeholder.com/800x400/1f3605/ffffff?text=Automation+Report+Generated+Successfully)


## Project structure

- .github -> yml file to execute the tests in GitHub Actions
- src -> Contains all the features & JavaScript code
- test-results -> Contains all the reports related file

## Architecture Diagram

```
┌─────────────────┐
│ Cucumber BDD    │
│ Framework       │
└─────────┬───────┘
          │
    ┌─────┼─────┐
    │     │     │
┌───▼──┐ ┌▼──┐ ┌▼──┐
│Features│ │Steps│ │Hooks│
│(.feature)│ │(TS)│ │(Browser│
└───┬───┘ └─┬─┘ │Setup)│
    │       │   └─────┘
    └───────┼─────────┐
            │         │
        ┌───▼──┐ ┌────▼────┐
        │Pages │ │Helper    │
        │(Page │ │(Env,     │
        │Objects)│ │Report,  │
        └─┬────┘ │Auth,     │
          │      │Utils)    │
          └──────┼─────────┘
                 │
            ┌────▼────┐
            │Playwright│
            │Wrapper   │
            └────┬─────┘
                 │
            ┌────▼────┐
            │Playwright│
            │Browser   │
            │Automation│
            └────┬─────┘
                 │
            ┌────▼────┐
            │Web App  │
            │Under Test│
            └─────────┘

Config (cucumber.js) → Framework
Test Data (CSV/JSON) → Helper
```

## Reports

1. [Multiple Cucumber Report](https://github.com/WasiqB/multiple-cucumber-html-reporter)
2. Default Cucumber report
3. [Logs](https://www.npmjs.com/package/winston)
4. Screenshots of failure
5. Test videos of failure
6. Trace of failure

## Get Started

### Setup:

1. Clone or download the project
2. Extract and open in the VS-Code
3. `npm i` to install the dependencies
4. `npx playwright install` to install the browsers
5. `npm run test` to execute the tests
6. To run a particular test change  
```
  paths: [
            "src/test/features/featurename.feature"
         ] 
```
7. Use tags to run a specific or collection of specs
```
npm run test --TAGS="@test or @add"
```

8. Commands for running 

Run All Tests (Default)

Runs the complete test flow including report generation.

npm test


Includes:

pretest → Initializes report setup

test → Executes all tests using cucumber-js

posttest → Generates final test report

🔁 Rerun Failed Tests

Runs only the scenarios listed in the rerun.txt file.

npm run test:failed

🌐 Run All Tests (Staging Environment)

Runs all tests on the staging environment.

npm run test:all

🚀 Smoke Tests

Runs only smoke test scenarios (tagged with @smoke).

`npm run test:smoke`

🧩 Regression Tests

Runs only regression test scenarios (tagged with @regression).

npm run test:regression

🧭 Staging Environment Tests

Runs all tests specifically on the staging environment.

npm run test:staging

✅ Sanity Tests (Production)

Runs sanity test scenarios on the production environment.

npm run test:sanity

### Folder structure
0. `src/pages` -> Page object models for UI screens
1. `src/test/features` -> Gherkin feature files
2. `src/test/steps` -> JavaScript step definitions
3. `src/support/hooks.js` -> Browser setup and teardown logic
4. `src/support/pageFixture.js` -> Shared page objects across steps
5. `src/support/customTypes.js` -> Custom Cucumber parameter types
6. `src/support/htmllSubStepLogger.js` -> HTML sub-step logging utilities
7. `src/support/textSubStepLogger.js` -> Text sub-step logging utilities
8. `src/helper/env` -> Environment configurations (.env files)
9. `src/helper/report` -> Report generation utilities
10. `src/helper/auth` -> Authentication storage states
11. `src/helper/util` -> Utilities for test data and logging
12. `src/helper` -> Runtime helper definitions
13. `src/helper/wrapper` -> Playwright wrapper utilities
14. `src/helper/browsers` -> Browser management
15. `src/helper/parsers` -> Data parsers (e.g., CSV)
16. `config/cucumber.js` -> Cucumber configuration
17. `package.json` -> Dependencies and scripts
18. `test-results` -> Generated test reports and artifacts
19. `.github` -> GitHub Actions workflows

