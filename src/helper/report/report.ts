const os = require("os");
const report = require("multiple-cucumber-html-reporter");

const deviceName = os.hostname(); // Gets the current machine name
const platformName = os.type();   // OS name, e.g., 'Windows_NT'
const platformVersion = os.release(); // OS version

report.generate({
    jsonDir: "test-results",
    reportPath: "test-results/reports/",
    reportName: "Playwright Automation Report",
    pageTitle: "BookCart App test report",
    displayDuration: false,
    metadata: {
        browser: {
            name: "chrome",
            version: "112",
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
            { label: "Project", value: "ASM Application" },
            { label: "Release", value: "1.2.3" },
            { label: "Cycle", value: "Smoke-1" }
        ],
    },
});
