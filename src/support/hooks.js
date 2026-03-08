const {
    BeforeAll,
    AfterAll,
    Before,
    After,
    BeforeStep,
    AfterStep,
    Status
} = require("@cucumber/cucumber");
const { fixture } = require("./pageFixture");
const { invokeBrowser } = require("../helper/browsers/browserManager");
const { createLogger } = require("winston");
const { options } = require("../helper/util/logger");
const { CSVParser } = require("../helper/parsers/CSVParser");
const fs = require("fs-extra");
const path = require("path");
const { getEnv } = require("../helper/env/env");
const { HTMLSubStepLogger } = require("./htmllSubStepLogger");
const LoginPage = require("../pages/loginPage");
const ContactPage = require("../pages/contactPage");
const { ApiContext } = require("../helper/api/context/ApiContext");

let browser;
let context;
let allData = [];
let apiJsonData = [];

function getField(obj, names) {
    for (const name of names) {
        if (obj[name] !== undefined && obj[name] !== null && obj[name] !== "") {
            return obj[name];
        }
    }
    return undefined;
}

function findDataByKeyAndEnv(rows, key, env) {
    return rows.find((row) => {
        const rowKey = getField(row, ["Key", "key", "TestCaseID", "testcaseid"]);
        const rowEnv = getField(row, ["Env", "env"]);
        return rowKey === key && String(rowEnv || "").toLowerCase() === env.toLowerCase();
    });
}

function findApiCaseByKeyEnvCase(rows, key, env, caseId) {
    return rows.find((row) => {
        const rowKey = getField(row, ["Key", "key"]);
        const rowEnv = getField(row, ["Env", "env"]);
        const rowCase = getField(row, ["CaseId", "caseId", "caseid"]);
        return rowKey === key
            && String(rowEnv || "").toLowerCase() === env.toLowerCase()
            && rowCase === caseId;
    });
}

function replaceStepPlaceholders(pickle, sourceData) {
    pickle.steps.forEach((step, index) => {
        pickle.steps[index].text = step.text.replace(/<([\w.]+)>/g, (_, nestedKey) => {
            const keys = nestedKey.split(".");
            let value = sourceData;
            for (const k of keys) {
                value = value ? value[k] : value;
            }
            if (Array.isArray(value)) {
                return value[0];
            }
            if (value === undefined || value === null || value === "") {
                return `<${nestedKey}>`;
            }
            return String(value);
        });
    });
}

BeforeAll(async function () {
    getEnv();

    const csvFilePath = path.join(__dirname, "../helper/util/test-data/testData.csv");
    allData = await CSVParser.parseData(csvFilePath, "|");

    const apiJsonPath = path.join(__dirname, "../helper/util/test-data/apiTestData.json");

    if (fs.existsSync(apiJsonPath)) {
        apiJsonData = await fs.readJson(apiJsonPath);
    }
});

Before(async function ({ pickle }) {
    const scenarioName = `${pickle.name}_${pickle.id}`;
    const env = process.env.ENV || "STG";
    fixture.env = env;
    const isApiScenario = pickle.tags.some((tag) => tag.name === "@api");
    fixture.logger = createLogger(options(scenarioName));
    fixture.logger.info(`Starting Scenario: ${pickle.name}`);
    fixture.api.context = new ApiContext();
    fixture.api.activeExpected = {};
    this.subStepLogger = new HTMLSubStepLogger(this.attach.bind(this));
    fixture.subStepLogger = this.subStepLogger;
    fixture.logger.info("Sub-step logger initialized for scenario.");

    const keyTag = pickle.tags.find((tag) => tag.name.startsWith("@Key:"));
    const key = keyTag ? keyTag.name.replace("@Key:", "").trim() : null;
    const caseTag = pickle.tags.find((tag) => tag.name.startsWith("@Case:"));
    const caseId = caseTag ? caseTag.name.replace("@Case:", "").trim() : null;

    if (key) {
        if (isApiScenario) {
            if (!caseId) {
                throw new Error(`@Case tag is required for API scenario with Key=${key}`);
            }

            const apiData = findApiCaseByKeyEnvCase(apiJsonData, key, env, caseId);

            if (!apiData) {
                throw new Error(`No API JSON test data found for Key=${key}, Case=${caseId} in Env=${env}`);
            }

            fixture.testData = {};
            fixture.api.testData = apiData;
            fixture.api.activeExpected = apiData.expected || {};
            replaceStepPlaceholders(pickle, apiData);
            fixture.logger.info(
                `Loaded API JSON test data -> Key: ${key}, Case: ${caseId}, Env: ${env}`
            );
        } else {
        fixture.api.testData = {};
        fixture.api.activeExpected = {};
        const testData = findDataByKeyAndEnv(allData, key, env);

        if (!testData) {
            throw new Error(`No CSV data found for Key=${key} in Env=${env}`);
        }

        if (testData.Group) {
            try {
                testData.Group = JSON.parse(testData.Group);
            } catch (e) {
                if (fixture.logger) {
                    fixture.logger.error(`Failed to parse Group field as JSON: ${testData.Group}`);
                }
            }
        }

        fixture.testData = testData;

        replaceStepPlaceholders(pickle, testData);

        this.stepArgsMap = new Proxy({}, {
            get: (_, prop) => testData[prop] || testData[String(prop).toLowerCase()] || `<${String(prop)}>`
        });

        if (fixture.logger) {
            fixture.logger.info(`Loaded scenario data -> Key: ${key}, Env: ${env}`);
        }
        }
    } else if (fixture.logger) {
        fixture.logger.info("No @Key tag found -> skipping CSV data load");
        fixture.testData = {};
        fixture.api.testData = {};
        fixture.api.activeExpected = {};
    }

    if (!isApiScenario) {
        if (!browser) {
            browser = await invokeBrowser();
            console.log("Browser launched for UI tests.");
        }

        context = await browser.newContext({
            viewport: null,
            ignoreHTTPSErrors: true,
            recordVideo: { dir: "test-results/videos" }
        });

        await context.tracing.start({
            name: scenarioName,
            title: pickle.name,
            screenshots: true,
            snapshots: true,
            sources: true
        });

        const page = await context.newPage();
        fixture.page = page;

        fixture.pages = {
            loginPage: new LoginPage(fixture.page, fixture.subStepLogger),
            contactPage: new ContactPage(fixture.page, fixture.subStepLogger)
        };
        fixture.logger.info("Page objects initialized for scenario.");
    } else {
        fixture.page = undefined;
        fixture.pages = {};
        fixture.logger.info("API scenario detected -> skipped browser/context/page initialization.");
    }
});

BeforeStep(async function ({ pickleStep }) {
    if (fixture.logger) {
        fixture.logger.info(`Step started -> ${pickleStep.text}`);
    }
});

AfterStep(async function ({ pickleStep, result }) {
    const stepText = pickleStep.text;
    const status = result && result.status ? result.status : "UNKNOWN";

    if (status === Status.PASSED) {
        if (fixture.logger) {
            fixture.logger.info(`Step passed -> ${stepText}`);
        }
    } else if (status === Status.FAILED) {
        if (fixture.logger) {
            fixture.logger.error(`Step failed -> ${stepText}`);
        }
        if (fixture.page) {
            const screenshot = await fixture.page.screenshot({
                path: `./test-results/screenshots/${Date.now()}_${stepText.replace(/[^a-zA-Z0-9]/g, "_")}.png`,
                type: "png"
            });
            await this.attach(screenshot, "image/png");
        }
    }
});

After(async function ({ pickle, result }) {
    if (context) {
        const scenarioPath = `./test-results/trace/${pickle.id}.zip`;
        await context.tracing.stop({ path: scenarioPath });
    }

    if (result && result.status === Status.PASSED && fixture.page) {
        const img = await fixture.page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, type: "png" });
        await this.attach(img, "image/png");

        const videoObj = fixture.page.video();
        const videoPath = videoObj ? await videoObj.path() : null;
        if (videoPath && fs.existsSync(videoPath)) {
            await this.attach(fs.readFileSync(videoPath), "video/webm");
        }

        await this.attach('<a href="https://trace.playwright.dev/" target="_blank">Open Trace</a>', "text/html");
    } else if (result && result.status === Status.FAILED && fixture.logger) {
        fixture.logger.error(`Scenario failed: ${pickle.name}`);
    }

    if (fixture.page) {
        await fixture.page.close();
    }
    if (context) {
        await context.close();
    }
    context = undefined;
    fixture.page = undefined;
});

AfterAll(async function () {
    if (browser) {
        await browser.close();
        console.log("Browser closed after all scenarios.");
    }
});
