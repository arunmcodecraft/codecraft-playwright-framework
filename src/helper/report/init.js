const fs = require("fs-extra");

try {
    fs.ensureDir("test-results");
    fs.emptyDir("test-results");
    fs.ensureDir("allure-results");
    fs.emptyDir("allure-results");
    fs.ensureDir("allure-report");
    fs.emptyDir("allure-report");
} catch (error) {
    console.log("Folder not created! " + error);
}
