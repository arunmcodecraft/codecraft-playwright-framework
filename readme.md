# Playwright + Cucumber Automation Framework (UI + API)

This framework supports:
- UI web automation with Playwright + Cucumber (BDD)
- API automation (data-driven, JSON-based, positive/negative + chaining)
- HTML + Allure reporting
- Key-based test selection for UI/API separation

## Prerequisites
- Node.js 16+
- npm
- Playwright browsers

## Setup
```bash
npm install
npx playwright install
```

## Project Structure
```text
config/
  cucumber.js

src/
  pages/                      # UI page objects
  support/                    # Hooks, fixtures, reporters
  test/
    features/
      ui/                     # UI feature files
      api/                    # API feature files
    steps/
      ui/                     # UI step definitions
      api/                    # API step definitions
  helper/
    api/
      client/                 # API client
      context/                # API runtime context for chaining
      resolver/               # Token resolver (${ctx.key})
      models/                 # POJO models
      schemas/                # JSON schemas
      validators/             # Schema validator
      logging/                # API structured logging
    util/test-data/
      testData.csv            # UI data (CSV)
      apiTestData.json        # API data (JSON only)
```

## UI Test Data (CSV)
UI scenarios use `@Key:<value>` and load data from:
- `src/helper/util/test-data/testData.csv`

Example key:
- `@Key:Contact_01`

## API Test Data (JSON only)
API scenarios use:
- `@Key:<API_KEY>`
- `@Case:<CASE_ID>`

Data source:
- `src/helper/util/test-data/apiTestData.json`

Each API case contains:
- `request` (method, path, headers, body)
- `expected` (status, content type, schema, body assertions)
- optional `followUpRequest` / `followUpExpected` for API chaining

## API Chaining
Supported via separate classes:
- `ApiContext` stores values during scenario runtime
- `TemplateResolver` resolves placeholders like `${ctx.orderId}`

Example flow:
1. Save `body.id` from response as context key `orderId`
2. Use `/store/order/${ctx.orderId}` in the next request

## Run Commands

### Standard
```bash
npm test
npm run test:all
npm run test:failed
```

### Tag-based
```bash
npm run test:smoke
npm run test:regression
npm run test:sanity
npm run test:api
```

### Key-based (recommended)
```bash
npm run test:key -- --testKey=api
npm run test:key -- --testKey=ui
npm run test:key -- --testKey=Contact_01
npm run test:key -- --testKey=API_Order_01
```

`testKey` behavior:
- `api` -> only `@api`
- `ui` -> only non-API scenarios
- any other key -> key-targeted scenarios (`@Key:<value>`) with domain-aware filtering

## Reports
After execution:
- Cucumber HTML: `test-results/reports/index.html`
- Cucumber JSON: `test-results/cucumber-report.json`
- Logs: `test-results/logs/<scenario>/log.log`
- Screenshots/Videos/Traces (UI scenarios)

Allure:
```bash
npm run allure:generate
npm run allure:open
npm run allure:serve
```

## CI/CD (GitHub Actions)
- Workflow file: `.github/workflows/ci.yml`
- Triggers:
  - push (main/master/develop)
  - pull_request (all branches)
  - manual (`workflow_dispatch`)
- Jobs:
  - `api-tests` -> runs only API suite (`testKey=api`)
  - `ui-tests` -> runs only UI suite (`testKey=ui`)
- CI env:
  - `ENV=STG`
  - `HEAD=true`
  - `BROWSER=chrome`
- Artifacts uploaded on every run (even failures):
  - `test-results`
  - `allure-results`
  - `allure-report`

## Logging
- UI: step logs + sub-step HTML attachments
- API: detailed request/response logs (status, payload, duration)
- Sensitive values are masked in API logs by default
- Add custom masked fields with env var:
  - `MASK_FIELDS=field1,field2`

## Environment
- `ENV=STG` and `ENV=PRD` are supported
- Env files:
  - `src/helper/env/.env.STG`
  - `src/helper/env/.env.PRD`

## Notes
- API scenarios do not launch browser/page context.
- UI scenarios use browser context, tracing, screenshots, and videos.
- Cucumber config uses:
  - `src/test/features/**/*.feature`
  - `src/test/steps/**/*.js`
