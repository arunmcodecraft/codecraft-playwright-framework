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

let browser;
let context;
let allData = [];

BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
    console.log("Browser launched for all tests.");

    const csvFilePath = path.join(__dirname, "../helper/util/test-data/testData.csv");
    allData = await CSVParser.parseData(csvFilePath, "|");
});

Before(async function ({ pickle }) {
    const scenarioName = `${pickle.name}_${pickle.id}`;
    const env = process.env.ENV || "STG";
    fixture.env = env;

    const keyTag = pickle.tags.find((tag) => tag.name.startsWith("@Key:"));
    const key = keyTag ? keyTag.name.replace("@Key:", "").trim() : null;

    if (key) {
        const testData = allData.find((row) => {
            const csvKey = row.Key || row.TestCaseID || row.key || row.testcaseid;
            const csvEnv = row.Env || row.env;
            return csvKey === key && csvEnv && csvEnv.toLowerCase() === env.toLowerCase();
        });

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

        pickle.steps.forEach((step, index) => {
            pickle.steps[index].text = step.text.replace(/<([\w.]+)>/g, (_, nestedKey) => {
                const keys = nestedKey.split(".");
                let value = testData;
                for (const k of keys) {
                    value = value ? value[k] : value;
                }
                return Array.isArray(value) ? value[0] : value || `<${nestedKey}>`;
            });
        });

        this.stepArgsMap = new Proxy({}, {
            get: (_, prop) => testData[prop] || testData[String(prop).toLowerCase()] || `<${String(prop)}>`
        });

        if (fixture.logger) {
            fixture.logger.info(`Loaded scenario data -> Key: ${key}, Env: ${env}`);
        }
    } else if (fixture.logger) {
        fixture.logger.info("No @Key tag found -> skipping CSV data load");
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
    fixture.logger = createLogger(options(scenarioName));
    fixture.logger.info(`Starting Scenario: ${pickle.name}`);

    this.subStepLogger = new HTMLSubStepLogger(this.attach.bind(this));
    fixture.subStepLogger = this.subStepLogger;
    fixture.logger.info("Sub-step logger initialized for scenario.");

    fixture.pages = {
        loginPage: new LoginPage(fixture.page, fixture.subStepLogger),
        contactPage: new ContactPage(fixture.page, fixture.subStepLogger)
    };
    fixture.logger.info("Page objects initialized for scenario.");
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
        const screenshot = await fixture.page.screenshot({
            path: `./test-results/screenshots/${Date.now()}_${stepText.replace(/[^a-zA-Z0-9]/g, "_")}.png`,
            type: "png"
        });
        await this.attach(screenshot, "image/png");
    }
});

After(async function ({ pickle, result }) {
    const scenarioPath = `./test-results/trace/${pickle.id}.zip`;
    await context.tracing.stop({ path: scenarioPath });

    if (result && result.status === Status.PASSED) {
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

    await fixture.page.close();
    await context.close();
});

AfterAll(async function () {
    await browser.close();
    console.log("Browser closed after all scenarios.");
});
