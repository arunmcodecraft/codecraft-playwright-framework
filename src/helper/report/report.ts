import * as dotenv from "dotenv";
import * as path from "path";

// Explicitly point to your env file
dotenv.config({ path: path.resolve(__dirname, "../env/.env.PRD") });
import * as os from "os";
import { generate } from "multiple-cucumber-html-reporter";
import { execSync } from "child_process";



dotenv.config();

// System info
const deviceName = os.hostname();
const platformName = os.type();      // e.g., 'Windows_NT', 'Darwin'
const platformVersion = os.release(); // e.g., '10.0.19045'

// Read values from .env with defaults
const projectName = process.env.PROJECT ;
const releaseVersion = process.env.RELEASE ;
const cycleName = process.env.CYCLE;
const baseUrl = process.env.BASEURL;
const headlessMode = process.env.HEAD;

// Browser info from .env
const browserName = process.env.BROWSER || "chrome";
let browserVersion = "Unknown";

// Try to detect browser version dynamically (cross-platform)
try {
    if (browserName.toLowerCase().includes("chrome")) {
        const versionOutput = execSync(
            process.platform === "win32" ? 'reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version' : 'google-chrome --version || chromium --version',
            { encoding: "utf8", stdio: ['pipe', 'pipe', 'ignore'] }
        );
        const match = versionOutput.match(/\d+\.\d+\.\d+\.\d+/);
        if (match) browserVersion = match[0];
    } else if (browserName.toLowerCase().includes("edge")) {
        const versionOutput = execSync(
            process.platform === "win32" ? 'reg query "HKEY_CURRENT_USER\\Software\\Microsoft\\Edge\\BLBeacon" /v version' : 'msedge --version',
            { encoding: "utf8", stdio: ['pipe', 'pipe', 'ignore'] }
        );
        const match = versionOutput.match(/\d+\.\d+\.\d+\.\d+/);
        if (match) browserVersion = match[0];
    } else if (browserName.toLowerCase().includes("firefox")) {
        const versionOutput = execSync("firefox --version", { encoding: "utf8" });
        const match = versionOutput.match(/\d+\.\d+/);
        if (match) browserVersion = match[0];
    }
} catch (err) {
    console.warn("Could not detect browser version dynamically. Using 'Unknown'.");
}

// Paths
const jsonDir = path.resolve("test-results");
const reportDir = path.join(jsonDir, "reports");

// Generate HTML report
generate({
    jsonDir: jsonDir,
    reportPath: reportDir,
    reportName: "Playwright Automation Report",
    pageTitle: "BookCart App Test Report",
    displayDuration: true,
    metadata: {
        browser: {
            name: browserName,
            version: browserVersion,
        },
        device: deviceName,
        platform: {
            name: platformName,
            version: platformVersion,
        },
    },
    customData: {
        title: "Test Info",
        data: [
            { label: "Project", value: projectName },
            { label: "Release", value: releaseVersion },
            { label: "Cycle", value: cycleName },
            { label: "Base URL", value: baseUrl },
            { label: "Headless Mode", value: headlessMode },
        ],
    },
});
