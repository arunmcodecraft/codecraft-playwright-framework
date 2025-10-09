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
import { CSVParser } from "../helper/parsers/CSVParser";
import * as configuration from "../helper/Commonconfig/configuration.json";
import * as fs from "fs-extra";
import * as path from "path";
import { getEnv } from "../helper/env/env";

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
    const scenarioName = `${pickle.name}_${pickle.id}`;
    const env = process.env.ENV || "STG";
    fixture.env = env;

    // Extract Module (first word of scenario name)
    const moduleMatch = pickle.name.match(/^[A-Za-z]+/);
    const moduleName = moduleMatch ? moduleMatch[0] : "Generic";

    // Extract Key from scenario tag @Key=XYZ
    const keyTag = pickle.tags.find(tag => tag.name.startsWith("@Key="));
    const key = keyTag ? keyTag.name.replace("@Key=", "").trim() : null;

    if (key) {
        // 🔹 Use relative path for CSV (portable)
        const csvFilePath = path.join(__dirname, "../helper/util/test-data/testData.csv");
        const allData = await CSVParser.parseData(csvFilePath, '|');

        // 🔹 Find the row matching Key + Env + Module
        const testData = allData.find((row: any) => {
            const csvKey = row.Key ?? row.TestCaseID ?? row.key ?? row.testcaseid;
            const csvEnv = row.Env ?? row.env;
            const csvModule = row.Module ?? row.module ?? moduleName;

            return (
                csvKey === key &&
                csvEnv?.toLowerCase() === env.toLowerCase() &&
                (row.Module ? csvModule === moduleName : true)
            );
        });

        if (!testData) throw new Error(`❌ No CSV data found for Key=${key} in Env=${env}, Module=${moduleName}`);
        fixture.testData = testData;

        fixture.logger?.info(`🔹 Loaded scenario data → Module: ${moduleName}, Key: ${key}, Env: ${env}`);
    } else {
        fixture.logger?.info("⚠️ No @Key tag found — skipping CSV data load");
    }

    // 🔹 Setup browser context & page
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
// 🧩 STEP HOOKS — Step-wise logging
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
    await context.tracing.stop({ path: scenarioPath });

    if (result?.status === Status.PASSED) {
        const img = await fixture.page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, type: "png" });
        await this.attach(img, "image/png");

        const videoPath = await fixture.page.video()?.path();
        if (videoPath && fs.existsSync(videoPath)) {
            await this.attach(fs.readFileSync(videoPath), "video/webm");
        }

        await this.attach(`<a href="https://trace.playwright.dev/" target="_blank">Open Trace</a>`, "text/html");
    } else if (result?.status === Status.FAILED) {
        fixture.logger?.error(`❌ Scenario failed: ${pickle.name}`);
    }

    await fixture.page.close();
    await context.close();
});

// ================================================================
// 🧩 AFTER ALL — Close browser
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
    if (user.endsWith("lead")) return "src/helper/auth/lead.json";
    return undefined;
}
