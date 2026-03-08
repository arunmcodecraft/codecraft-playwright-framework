const dotenv = require("dotenv");
const path = require("path");
const os = require("os");
const { generate } = require("multiple-cucumber-html-reporter");
const { execSync } = require("child_process");
const fs = require("fs");

dotenv.config({
    path: path.resolve(__dirname, "../env/.env.PRD")
});

const deviceName = os.hostname();
const platformName = os.type();
const platformVersion = os.release();

const projectName = process.env.PROJECT || "PracticeTestAutomation";
const releaseVersion = process.env.RELEASE || "1.0.0";
const cycleName = process.env.CYCLE || "Smoke-1";
const baseUrl = process.env.BASEURL || "https://practicetestautomation.com/";
const headlessMode = process.env.HEAD || "true";
const browserName = process.env.BROWSER || "chrome";
const runType = (process.env.TEST_RUN_TYPE || "mixed").toLowerCase();

let browserVersion = "Unknown";

try {
    if (browserName.toLowerCase().includes("chrome")) {
        const versionOutput = execSync(
            process.platform === "win32"
                ? 'reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version'
                : process.platform === "darwin"
                ? '/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --version 2>/dev/null || google-chrome --version || chromium --version'
                : "google-chrome --version || chromium --version",
            { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
        );
        const match = versionOutput.match(/\d+\.\d+\.\d+\.\d+/);
        if (match) {
            browserVersion = match[0];
        }
    }

    if (browserName.toLowerCase().includes("edge")) {
        const versionOutput = execSync(
            process.platform === "win32"
                ? 'reg query "HKEY_CURRENT_USER\\Software\\Microsoft\\Edge\\BLBeacon" /v version'
                : process.platform === "darwin"
                ? '/Applications/Microsoft\\ Edge.app/Contents/MacOS/Microsoft\\ Edge --version 2>/dev/null || msedge --version'
                : "msedge --version",
            { encoding: "utf8", stdio: ["pipe", "pipe", "ignore"] }
        );
        const match = versionOutput.match(/\d+\.\d+\.\d+\.\d+/);
        if (match) {
            browserVersion = match[0];
        }
    }

    if (browserName.toLowerCase().includes("firefox")) {
        const versionOutput = execSync(
            process.platform === "darwin"
                ? '/Applications/Firefox.app/Contents/MacOS/firefox --version 2>/dev/null || firefox --version'
                : "firefox --version",
            { encoding: "utf8"
        });
        const match = versionOutput.match(/\d+\.\d+/);
        if (match) {
            browserVersion = match[0];
        }
    }
} catch (error) {
    console.warn("Could not detect browser version.");
}

const jsonDir = path.resolve("test-results");
const reportDir = path.join(jsonDir, "reports");

if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

const cssContent = `
body {
    background-color: #1f3605ff !important;
}

.main_container {
    background: #ffffff !important;
    padding: 15px;
    border-radius: 10px;
}

@media (prefers-color-scheme: dark) {
    body {
        background-color: #1a1a1a !important;
    }
    .main_container, .x_panel {
        background: #2a2a2a !important;
        color: #ffffff !important;
    }
    .x_title {
        color: #ffffff !important;
        border-bottom: 2px solid #1f3605ff !important;
    }
    table, th, td {
        color: #ffffff !important;
        border-color: #444 !important;
    }
}

body.dark-mode {
    background-color: #1a1a1a !important;
}
body.dark-mode .main_container,
body.dark-mode .x_panel {
    background: #2a2a2a !important;
    color: #ffffff !important;
}

.x_title h2 {
    font-weight: bold;
    color: #333;
}

body.dark-mode .x_title h2 {
    color: #ffa500;
}
`;

const cssPath = path.join(reportDir, "custom-style.css");
fs.writeFileSync(cssPath, cssContent, { encoding: "utf8" });

const reportOptions = {
    jsonDir,
    reportPath: reportDir,
    reportName: "Automation Report",
    pageTitle: runType === "api" ? "API Automation Test Results" : "Automation Test Results",
    displayDuration: true,
    durationInMS: false,
    removeExistingJsonReport: false,
    customData: {
        title: "Execution Details",
        data: [
            { label: "Project", value: projectName },
            { label: "Release", value: releaseVersion },
            { label: "Cycle", value: cycleName },
            { label: "Run Type", value: runType.toUpperCase() },
            { label: "Base URL", value: baseUrl },
            { label: "Headless", value: headlessMode }
        ]
    },
    customStyle: cssPath
};

if (runType !== "api") {
    reportOptions.metadata = {
        browser: {
            name: browserName,
            version: browserVersion
        },
        device: deviceName,
        platform: {
            name: platformName,
            version: platformVersion
        }
    };
    reportOptions.customData.data.push(
        { label: "Executed At", value: new Date().toLocaleString() }
    );
} else {
    reportOptions.customData.data.push(
        { label: "Executed At", value: new Date().toLocaleString() },
        { label: "Metadata Profile", value: "API-focused (browser/device hidden)" }
    );
}

generate(reportOptions);

console.log("Report Generated Successfully!");
