import {
    BeforeAll,
    AfterAll,
    Before,
    After,
    BeforeStep,
    AfterStep,
    Status
} from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
import { readFromDataFileUtils } from "../helper/readFromDataFile/readFromDataFileUtils";
import * as configuration from "../helper/Commonconfig/configuration.json";
import { getEnv } from "../helper/env/env";
const fs = require("fs-extra");

// ----------------- Global Variables -----------------
let browser: Browser;
let context: BrowserContext;

// ================================================================
// 🧩 BEFORE ALL — Launch Browser once before all features
// ================================================================
BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
    console.log("✅ Browser launched for all tests.");
});

// ================================================================
// 🧩 BEFORE SCENARIO — Setup context, page, and data per scenario
// ================================================================
Before(async function ({ pickle }) {
    const scenarioName = pickle.name + "_" + pickle.id;
    const env = process.env.ENV || "staging";
    fixture.env = env;

    // 🔹 Extract Module and TestCaseID from Scenario name
    const moduleMatch = pickle.name.match(/^[A-Za-z]+/); // e.g., "Login"
    const keyMatch = pickle.name.match(/[A-Za-z]+_\d+/); // e.g., "Login_01"
    const moduleName = moduleMatch ? moduleMatch[0] : "Generic";
    const testCaseID = keyMatch ? keyMatch[0] : null;

    // 🔹 Load CSV data dynamically
    if (testCaseID) {
        const allData = await readFromDataFileUtils.readCSV(configuration.testDataLocation);
        const testData = allData.find(
            (row: any) =>
                row.TestCaseID === testCaseID &&
                row.Env.toLowerCase() === env.toLowerCase() &&
                (row.Module ? row.Module === moduleName : true)
        );

        if (!testData) throw new Error(`❌ No CSV data found for ${testCaseID} in Env=${env}, Module=${moduleName}`);
        fixture.testData = testData;
    }

    // 🔹 Setup context & page
    const isAuthScenario = pickle.tags.some(tag => tag.name === "@auth");
    context = await browser.newContext({
        viewport: null,
        storageState: isAuthScenario ? getStorageState(pickle.name) : undefined,
        recordVideo: { dir: "test-results/videos" },
    });

    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        screenshots: true,
        snapshots: true,
        sources: true,
    });

    const page: Page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
    fixture.logger.info(`🚀 Starting Scenario: ${pickle.name}`);
});

// ================================================================
// 🧩 STEP HOOKS — Step-wise logging and failure screenshots
// ================================================================
BeforeStep(async function ({ pickleStep }) {
    fixture.logger?.info(`🟡 Step started → ${pickleStep.text}`);
});

AfterStep(async function ({ pickleStep, result }) {
    const stepText = pickleStep.text;
    const status = result?.status || "UNKNOWN";

    if (status === Status.PASSED) {
        fixture.logger?.info(`✅ Step passed → ${stepText}`);
    } else if (status === Status.FAILED) {
        fixture.logger?.error(`❌ Step failed → ${stepText}`);
        const screenshot = await fixture.page.screenshot({
            path: `./test-results/screenshots/${Date.now()}_${stepText.replace(/[^a-zA-Z0-9]/g, "_")}.png`,
            type: "png"
        });
        await this.attach(screenshot, "image/png");
    }
});

// ================================================================
// 🧩 AFTER SCENARIO — Attach trace, video, screenshot
// ================================================================
After(async function ({ pickle, result }) {
    const scenarioPath = `./test-results/trace/${pickle.id}.zip`;

    // Stop tracing and close resources
    await context.tracing.stop({ path: scenarioPath });

    let videoPath: string | undefined;
    let img: Buffer | undefined;

    if (result?.status === Status.PASSED) {
        img = await fixture.page.screenshot({
            path: `./test-results/screenshots/${pickle.name}.png`,
            type: "png"
        });
        await this.attach(img, "image/png");

        videoPath = await fixture.page.video()?.path();
        if (videoPath && fs.existsSync(videoPath)) {
            await this.attach(fs.readFileSync(videoPath), "video/webm");
        }

        const traceFileLink = `<a href="https://trace.playwright.dev/" target="_blank">Open Trace</a>`;
        await this.attach(`Trace file: ${traceFileLink}`, "text/html");
    } else if (result?.status === Status.FAILED) {
        fixture.logger?.error(`❌ Scenario failed: ${pickle.name}`);
    }

    await fixture.page.close();
    await context.close();
});

// ================================================================
// 🧩 AFTER ALL — Close Browser once all tests done
// ================================================================
AfterAll(async function () {
    await browser.close();
    console.log("🧹 Browser closed after all scenarios.");
});

// ================================================================
// 🔹 Helper for storage state
// ================================================================
function getStorageState(user: string) {
    if (user.endsWith("admin")) return "src/helper/auth/admin.json";
    else if (user.endsWith("lead")) return "src/helper/auth/lead.json";
    else return undefined;
}
