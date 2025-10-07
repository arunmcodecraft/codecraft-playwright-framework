import { BeforeAll, AfterAll, Before, After, Status } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "@playwright/test";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
import { readFromDataFileUtils } from "../helper/readFromDataFile/readFromDataFileUtils";
import * as configuration from "../helper/Commonconfig/configuration.json";
const fs = require("fs-extra");
import { getEnv } from "../helper/env/env";



let browser: Browser;
let context: BrowserContext;

// ----------------- Before All -----------------
BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
});

// ----------------- Unified Before Hook -----------------
Before(async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id;
    const env = process.env.ENV || "staging";
    fixture.env = env;

    // ----------------- Extract Module and TestCaseID -----------------
    const moduleMatch = pickle.name.match(/^[A-Za-z]+/);       // e.g., "Login", "Reg"
    const keyMatch = pickle.name.match(/[A-Za-z]+_\d+/);      // e.g., "Login_01", "Reg_01"
    const moduleName = moduleMatch ? moduleMatch[0] : "Generic";
    const testCaseID = keyMatch ? keyMatch[0] : null;

    if (testCaseID) {
        // ----------------- Read CSV -----------------
        const allData = await readFromDataFileUtils.readCSV(configuration.testDataLocation);
        const testData = allData.find(
            (row: any) =>
                row.TestCaseID === testCaseID &&
                row.Env.toLowerCase() === env.toLowerCase() &&
                (row.Module ? row.Module === moduleName : true)
        );

        if (!testData) throw new Error(`❌ No CSV data found for ${testCaseID} in Env=${env} on module=${moduleName}`);
        fixture.testData = testData;

        fixture.logger?.info(`🔹 Scenario data loaded → Module: ${moduleName}, Key: ${testCaseID}, Env: ${env}, Username: ${testData.userName}`);
    } else {
        fixture.logger?.info("⚠️ No TestCaseID found — skipping CSV data loading for this scenario");
    }

    // ----------------- Setup Playwright Context -----------------
    const isAuthScenario = pickle.tags.some(tag => tag.name === "@auth");

    context = await browser.newContext({
        viewport: null,
        storageState: isAuthScenario ? getStorageState(pickle.name) : undefined,
        recordVideo: { dir: "test-results/videos" },
    });

    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true,
        snapshots: true,
    });

    const page: Page = await context.newPage();
    fixture.page = page;
    fixture.logger = createLogger(options(scenarioName));
});

// ----------------- After Scenario -----------------
After(async function ({ pickle, result }) {
    let videoPath: string;
    let img: Buffer;
    const path = `./test-results/trace/${pickle.id}.zip`;

    if (result?.status === Status.PASSED) {
        img = await fixture.page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, type: "png" });
        videoPath = await fixture.page.video().path();
    }

    await context.tracing.stop({ path });
    await fixture.page.close();
    await context.close();

    if (result?.status === Status.PASSED) {
        await this.attach(img, "image/png");
        await this.attach(fs.readFileSync(videoPath), "video/webm");
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`;
        await this.attach(`Trace file: ${traceFileLink}`, "text/html");
    }
});

// ----------------- After All -----------------
AfterAll(async function () {
    await browser.close();
});

// ----------------- Storage State Helper -----------------
function getStorageState(user: string) {
    if (user.endsWith("admin")) return "src/helper/auth/admin.json";
    else if (user.endsWith("lead")) return "src/helper/auth/lead.json";
}
