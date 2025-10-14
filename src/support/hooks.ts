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

    // ---------------- Extract Tags ----------------
    const keyTag = pickle.tags.find(tag => tag.name.toLowerCase().startsWith("@key:"));
    const key = keyTag ? keyTag.name.split(":")[1].trim() : null;

    const dataFileTag = pickle.tags.find(tag => tag.name.toLowerCase().startsWith("@datafile:"));
    const dataFilePath = dataFileTag
        ? path.join(__dirname, `../${dataFileTag.name.split(":")[1].trim()}`)
        : path.join(__dirname, "../helper/util/test-data/testData.csv"); // default fallback

    // ---------------- Load Data ----------------
    if (!fs.existsSync(dataFilePath)) {
        throw new Error(`❌ Data file not found: ${dataFilePath}`);
    }

    let testDataRows: Record<string, string>[] = [];

    if (dataFilePath.endsWith(".csv")) {
        // CSV parsing
        testDataRows = await CSVParser.parseData(dataFilePath, '|');
    } else if (dataFilePath.endsWith(".json")) {
        // JSON parsing
        const jsonContent = JSON.parse(fs.readFileSync(dataFilePath, "utf-8"));
        if (Array.isArray(jsonContent)) {
            testDataRows = jsonContent;
        } else {
            throw new Error(`❌ JSON file must contain an array of objects: ${dataFilePath}`);
        }
    } else {
        throw new Error(`❌ Unsupported data file type: ${dataFilePath}`);
    }

    // ---------------- Find row by Key + Env ----------------
    if (key) {
        const testData = testDataRows.find(row => {
            const rowKey = row.Key ?? row.TestCaseID ?? row.key ?? row.testcaseid;
            const rowEnv = row.Env ?? row.env;
            return rowKey === key && rowEnv?.toLowerCase() === env.toLowerCase();
        });

        if (!testData) {
            throw new Error(`❌ No data found for Key=${key} in Env=${env} in file=${dataFilePath}`);
        }

        fixture.testData = testData;

        // Replace placeholders <username> etc. in steps
        pickle.steps.forEach((step, i) => {
            pickle.steps[i].text = step.text.replace(/<(\w+)>/g, (_, k) => testData[k] ?? `<${k}>`);
        });

        // Dynamic step args mapping
        // @ts-ignore
        this.stepArgsMap = new Proxy({}, {
            get: (_, prop: string) => testData[prop] ?? testData[prop.toLowerCase()] ?? `<${prop}>`
        });

        fixture.logger?.info(`🔹 Loaded data from: ${dataFilePath} | Key=${key} | Env=${env}`);
    } else {
        fixture.logger?.info(`⚠️ No @Key tag found — skipping data load`);
    }

    // ---------------- Browser Context Setup ----------------
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

    // Debug
    console.log("Resolved dataFilePath:", dataFilePath);
    console.log("Scenario Key:", key);
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
    if (user.endsWith("admin")) return path.join(__dirname, "../helper/auth/admin.json");
    if (user.endsWith("lead")) return path.join(__dirname, "../helper/auth/lead.json");
    return undefined;
}
